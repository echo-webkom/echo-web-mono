import { eq } from "drizzle-orm";
import { z } from "zod";

import { auth } from "@echo-webkom/auth";
import { db } from "@echo-webkom/db";
import { type StrikeInfoInsert } from "@echo-webkom/db/schemas";

import { createStrikes, deleteStrike } from "@/data/strikes/mutations";
import { isMemberOf } from "@/lib/memberships";

const BAN_AMOUNT = 5;

function getBannableStrikeIndex(current: number, added: number) {
  if (current + added >= BAN_AMOUNT) {
    return current + added - BAN_AMOUNT - 1;
  }
}

export async function remvoveStrike(strikeId: number) {
  try {
    const issuer = await auth();

    if (!issuer) {
      return {
        success: false,
        message: "Du er ikke logget inn",
      };
    }

    const isAllowed = isMemberOf(issuer, ["bedkom"]);

    if (!isAllowed) {
      return {
        success: false,
        message: "Du har ikke tilgang til å fjerne prikker",
      };
    }
    const strike = await db.query.strikes.findFirst({
      where: (s) => eq(s.id, strikeId),
    });

    if (!strike) {
      return {
        success: false,
        message: "Fant ikke prikken i databasen",
      };
    }

    await deleteStrike(strike.userId, strikeId);

    return {
      success: true,
      message: "Prikken er slettet",
    };
  } catch (error) {
    return {
      success: false,
      message: "En feil har oppstått",
    };
  }
}

export async function manualAddStrike(
  userId: string,
  happeningId: string,
  reason: string,
  amount: number,
  currentAmount: number,
) {
  try {
    const issuer = await auth();

    if (!issuer) {
      return {
        success: false,
        message: "Du er ikke logget inn",
      };
    }

    const isAllowed = isMemberOf(issuer, ["bedkom"]);

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
        message: "Fant ikke brukeren",
      };
    }

    const happening = await db.query.happenings.findFirst({
      where: (happening) => eq(happening.id, happeningId),
    });

    if (!happening) {
      return {
        success: false,
        message: "Fant ikke bedriftspresentasjonen",
      };
    }

    const bannableStrikeNumber = getBannableStrikeIndex(currentAmount, amount);

    const data = {
      happeningId: happening.id,
      issuerId: issuer.id,
      reason: reason,
    } satisfies StrikeInfoInsert;

    await createStrikes(data, userId, amount, bannableStrikeNumber);

    return {
      success: true,
      message: "Prikker lagt til",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Informasjonen er ikke i riktig format",
      };
    }

    return {
      success: false,
      message: "En feil har oppstått",
    };
  }
}
