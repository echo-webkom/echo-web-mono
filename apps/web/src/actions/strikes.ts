"use server";

import { and, eq, gt, or } from "drizzle-orm";

import { auth } from "@echo-webkom/auth";
import { db } from "@echo-webkom/db";
import { strikes, users, type StrikeInsert } from "@echo-webkom/db/schemas";
import { strikeInfo, type StrikeInfoInsert } from "@echo-webkom/db/schemas/strike-info";

export const BAN_AMOUNT = 5;

type TUser = {
  userId: string;
  bannedFromStrike: number | null;
};

export type StrikeType =
  | "UNREGISTER_BEFORE_DEADLINE"
  | "UNREGISTER_AFTER_DEADLINE"
  | "NO_SHOW"
  | "WRONG_INFO"
  | "TOO_LATE"
  | "NO_FEEDBACK"
  | "OTHER";

export const STRIKE_TYPE_MESSAGE: Record<StrikeType, string> = {
  UNREGISTER_BEFORE_DEADLINE: "Du har meldt deg av før påmeldingsfristen",
  UNREGISTER_AFTER_DEADLINE: "Du har meldt deg av etter påmeldingsfristen",
  NO_SHOW: "Du har ikke møtt opp",
  WRONG_INFO: "Du har gitt feil informasjon",
  TOO_LATE: "Du har meldt deg av for sent",
  NO_FEEDBACK: "Du har ikke gitt tilbakemelding",
  OTHER: "Annet",
} as const;

export const STRIKE_TYPE_AMOUNT: Record<StrikeType, number | null> = {
  UNREGISTER_BEFORE_DEADLINE: 1,
  UNREGISTER_AFTER_DEADLINE: 2,
  NO_SHOW: 1, // and excluded from next three eligable happenings
  WRONG_INFO: 1,
  TOO_LATE: 1,
  NO_FEEDBACK: 1,
  OTHER: null,
} as const;

async function getBannableStrike<T extends TUser>(user: T, amount: number, type: StrikeType) {
  if (type === "NO_SHOW") return 1;

  const userStrikes = await db.query.strikes.findMany({
    with: { strikeInfo: true },
    where: (strike) =>
      and(gt(strike.id, user.bannedFromStrike ?? -1), eq(strikeInfo.userId, user.userId)),
  });

  const newStrikesAmount = userStrikes.length + amount;

  if (newStrikesAmount >= BAN_AMOUNT) {
    return amount - (newStrikesAmount % BAN_AMOUNT);
  } else return null;
}

async function insertStrikes(
  data: StrikeInfoInsert,
  amount: number,
  bannableStrikeNumber: number | null,
) {
  try {
    const info = await db
      .insert(strikeInfo)
      .values(data)
      .returning({ id: strikeInfo.id })
      .then((res) => res[0] ?? null);

    if (!info) {
      throw Error("Something went wrong");
    }

    const issuedStrikes = await db
      .insert(strikes)
      .values(
        Array.from({ length: amount }).map(
          () =>
            ({
              strikeInfoId: info.id,
            }) satisfies StrikeInsert,
        ),
      )
      .returning({ id: strikes.id });

    if (issuedStrikes.length !== amount) {
      throw Error("Something went wrong");
    }

    if (bannableStrikeNumber) {
      const bannableStrikeId = issuedStrikes[bannableStrikeNumber - 1]!.id;

      const banUser = await db
        .update(users)
        .set({ bannedFromStrike: bannableStrikeId })
        .where(eq(users.id, data.userId))
        .then((res) => res[0] ?? null);

      if (!banUser) {
        throw Error("Something went wrong");
      }
    }

    return {
      success: true,
      message: "Prikker lagt til",
    };
  } catch {
    return {
      success: false,
      message: "En feil har oppstått",
    };
  }
}

export async function manualAddStrike(
  happeningId: string,
  userId: string,
  reason: string,
  amount: number,
  type: StrikeType,
) {
  const issuer = await auth();

  if (!issuer) {
    return {
      success: false,
      message: "Du er ikke logget inn",
    };
  }

  const isAllowed = await db.query.usersToGroups.findFirst({
    where: (user) =>
      eq(user.userId, issuer.id) && or(eq(user.groupId, "bedkom"), eq(user.groupId, "webkom")),
  });

  if (!isAllowed) {
    return {
      success: false,
      message: "Du har ikke tilgang til å gi prikker",
    };
  }

  if (amount < 1) {
    return {
      success: false,
      message: "Antall prikker tildelt må være større enn 0",
    };
  }

  const user = await db.query.users.findFirst({
    where: (user) => eq(user.id, userId),
  });

  if (!user) {
    return {
      success: false,
      message: "Brukeren finnes ikke",
    };
  }

  const happening = await db.query.happenings.findFirst({
    where: (happening) => eq(happening.id, happeningId),
  });

  if (!happening) {
    return {
      success: false,
      message: "Arrangementet finnes ikke",
    };
  }

  const bannableStrikeNumber = await getBannableStrike(
    { userId: user.id, bannedFromStrike: user.bannedFromStrike },
    amount,
    type,
  );

  const data = {
    happeningId: happening.id,
    userId: user.id,
    issuerId: issuer.id,
    reason: reason,
  } satisfies StrikeInfoInsert;

  await insertStrikes(data, amount, bannableStrikeNumber);
}

export async function automaticAddStrike(
  happeningId: string,
  userId: string,
  bannedFromStrike: number | null,
  type: StrikeType,
) {
  const reason = STRIKE_TYPE_MESSAGE[type];
  const amount = STRIKE_TYPE_AMOUNT[type];

  if (!amount || amount < 1) {
    return {
      success: false,
      message: "Antall prikker tildelt må være større enn 0",
    };
  }

  const bannableStrikeNumber = await getBannableStrike(
    { userId: userId, bannedFromStrike: bannedFromStrike },
    amount,
    type,
  );

  const data = {
    happeningId: happeningId,
    userId: userId,
    issuerId: userId,
    reason: reason,
  } satisfies StrikeInfoInsert;

  await insertStrikes(data, amount, bannableStrikeNumber);
}
