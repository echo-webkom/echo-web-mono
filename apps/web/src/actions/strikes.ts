"use server";

import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@echo-webkom/db";
import { StrikeNotificationEmail } from "@echo-webkom/email";
import { emailClient } from "@echo-webkom/email/client";
import { strikeTypeSchema, type StrikeType } from "@echo-webkom/lib/src/constants";

import { createStrikes, deleteStrike } from "@/data/strikes/mutations";
import { groupActionClient } from "@/lib/safe-action";

const getBannableStrikeNumber = (current: number, added: number) => {
  const BAN_AMOUNT = 5;

  if (current + added >= BAN_AMOUNT) {
    return BAN_AMOUNT - current;
  }
};

export const removeStrikeAction = groupActionClient(["bedkom", "webkom"])
  .metadata({ actionName: "removeStrike" })
  .schema(z.object({ strikeId: z.number() }))
  .action(async ({ parsedInput }) => {
    const { strikeId } = parsedInput;

    const strike = await db.query.strikes.findFirst({
      where: (s) => eq(s.id, strikeId),
    });

    if (!strike) {
      throw new Error("Fant ikke prikken");
    }

    await deleteStrike(strike.userId, strikeId);

    return {
      success: true,
      message: "Prikken ble slettet",
    };
  });

export const addStrikeAction = groupActionClient(["webkom"])
  .metadata({ actionName: "addStrike" })
  .schema(
    z.object({
      userId: z.string(),
      happeningId: z.string(),
      reason: z.string(),
      amount: z.number(),
      currentAmount: z.number(),
      type: strikeTypeSchema.default("OTHER"),
    }),
  )
  .action(async ({ parsedInput, ctx }) => {
    const { user: issuer } = ctx;
    const { userId, happeningId, reason, amount, currentAmount, type } = parsedInput;

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

    await createStrikes(
      {
        happeningId: happening.id,
        issuerId: issuer.id,
        reason: reason,
      },
      user.id,
      amount,
      bannableStrikeNumber,
    );

    await emailClient.sendEmail(
      [user.alternativeEmail ?? user.email],
      `Du har fått ${amount} ${amount > 1 ? "prikker" : "prikk"} fra ${happening.title}`,
      StrikeNotificationEmail({
        happeningTitle: happening.title,
        name: user.name ?? "Ukjent",
        reason: reason ?? "Ingen grunn oppgitt",
        amount: amount,
        isBanned: user.isBanned,
      }),
    );

    return {
      success: true,
      message: "Prikker lagt til",
    };
  });
