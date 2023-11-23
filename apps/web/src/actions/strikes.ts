"use server";

import { eq } from "drizzle-orm";

import { getAuth } from "@echo-webkom/auth";
import { db } from "@echo-webkom/db";
import { strikes, type StrikeInsert } from "@echo-webkom/db/schemas";
import { strikeInfo, type StrikeInfoInsert } from "@echo-webkom/db/schemas/strike-info";

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

export const STRIKE_TYPE_POINTS: Record<StrikeType, number | null> = {
  UNREGISTER_BEFORE_DEADLINE: 1,
  UNREGISTER_AFTER_DEADLINE: 2,
  NO_SHOW: 1, // and excluded from next three eligable happenings
  WRONG_INFO: 1,
  TOO_LATE: 1,
  NO_FEEDBACK: 1,
  OTHER: null,
} as const;

export async function addStrike(
  happeningSlug: string,
  userId: string,
  reason: string,
  amount: number,
) {
  try {
    const issuer = await getAuth();

    if (!issuer) {
      return {
        success: false,
        message: "Du er ikke logget inn",
      };
    }

    if (issuer.type !== "admin") {
      const isBedkom = await db.query.usersToGroups.findFirst({
        where: (user) => eq(user.userId, userId) && eq(user.groupId, "bedkom"),
      });

      if (!isBedkom) {
        return {
          success: false,
          message: "Du har ikke lov til å gi prikker",
        };
      }
    }

    if (amount < 1) {
      return {
        success: false,
        message: "Antall prikker tildelt må være større enn 0",
      };
    }

    const happening = await db.query.happenings.findFirst({
      where: (happening) => eq(happening.slug, happeningSlug),
    });

    if (!happening) {
      return {
        success: false,
        message: "Arrangementet finnes ikke",
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

    const data = {
      happeningSlug: happening.slug,
      userId: user.id,
      issuerId: issuer.id,
      reason: reason,
    } satisfies StrikeInfoInsert;

    const info = await db
      .insert(strikeInfo)
      .values(data)
      .returning({ id: strikeInfo.id })
      .then((res) => res[0] ?? null);

    if (!info) {
      throw Error("Something went wrong");
    }

    const issuedStrikes = Array.from({ length: amount }).map(
      () =>
        ({
          strikeInfoId: info.id,
        }) satisfies StrikeInsert,
    );

    await db.insert(strikes).values(issuedStrikes);

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
