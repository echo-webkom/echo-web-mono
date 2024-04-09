"use server";

import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { auth } from "@echo-webkom/auth";
import { db } from "@echo-webkom/db";
import { type StrikeInfoInsert } from "@echo-webkom/db/schemas";
import { StrikeNotificationEmail } from "@echo-webkom/email";
import { emailClient } from "@echo-webkom/email/client";
import { type StrikeType } from "@echo-webkom/lib/src/constants";

import { createStrikes, deleteStrike } from "@/data/strikes/mutations";
import { isBedkom } from "@/lib/memberships";
import { getContactsBySlug } from "@/sanity/utils/contacts";

function getBannableStrikeNumber(current: number, added: number) {
  const BAN_AMOUNT = 5;

  if (current + added >= BAN_AMOUNT) {
    return BAN_AMOUNT - current;
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

    const isAllowed = isBedkom(issuer);

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
        message: "Fant ikke prikken",
      };
    }

    await deleteStrike(strike.userId, strikeId);

    return {
      success: true,
      message: "Prikken ble slettet",
    };
  } catch (error) {
    return {
      success: false,
      message: "En feil har oppstått",
    };
  }
}

export async function addStrike(
  userId: string,
  happeningId: string,
  reason: string,
  amount: number,
  currentAmount: number,
  type: StrikeType,
) {
  try {
    const issuer = await auth();

    if (!issuer) {
      return {
        success: false,
        message: "Du er ikke logget inn",
      };
    }

    const isAllowed = isBedkom(issuer);

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
      where: (happening) => and(eq(happening.id, happeningId), eq(happening.type, "bedpres")),
    });

    if (!happening) {
      return {
        success: false,
        message: "Fant ikke bedriftspresentasjonen",
      };
    }

    const bannableStrikeNumber =
      type === ("NO_SHOW" as StrikeType) ? 1 : getBannableStrikeNumber(currentAmount, amount);

    const data = {
      happeningId: happening.id,
      issuerId: issuer.id,
      reason: reason,
    } satisfies StrikeInfoInsert;

    await createStrikes(data, user.id, amount, bannableStrikeNumber);

    const contacts = await getContactsBySlug(happening.slug);
    if (contacts.length > 0) {
      await emailClient.sendEmail(
        contacts.map((contact) => contact.email),
        `Hei, ${user.name ?? "Ukjent"}. Du har fått ${amount} ${amount > 1 ? "prikker" : "prikk"} fordi ${reason}, i ${happening.title}`,
        StrikeNotificationEmail({
          happeningTitle: happening.title,
          name: user.name ?? "Ukjent",
          reason: reason ?? "Ingen grunn oppgitt",
          amount: amount,
          isBanned: user.isBanned,
        }),
      );
    }

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
