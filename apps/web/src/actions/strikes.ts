"use server";

import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@echo-webkom/db";
import { users, type StrikeInfoInsert } from "@echo-webkom/db/schemas";
import { STRIKE_TYPES } from "@echo-webkom/lib/src/constants";

import { createStrikes, deleteStrike } from "@/data/strikes/mutations";
import { isBedkom } from "@/lib/memberships";
import { authedAction } from "@/lib/safe-actions";

function getBannableStrikeNumber(current: number, added: number) {
  const BAN_AMOUNT = 5;

  if (current + added >= BAN_AMOUNT) {
    return BAN_AMOUNT - current;
  }
}

export const removeStrike = authedAction.input(z.number()).create(async ({ input, ctx }) => {
  if (!isBedkom(ctx.user)) {
    throw new Error("Du har ikke tilgang til å fjerne prikker");
  }
  const strike = await db.query.strikes.findFirst({
    where: (s) => eq(s.id, input),
  });

  if (!strike) {
    throw new Error("Fant ikke prikken");
  }

  await deleteStrike(strike.userId, input);

  return "Prikken ble slettet";
});

export const addStrike = authedAction
  .input(
    z.object({
      userId: z.string(),
      happeningId: z.string(),
      reason: z.string(),
      amount: z.number(),
      currentAmount: z.number(),
      type: z.enum(STRIKE_TYPES),
    }),
  )
  .create(async ({ input, ctx }) => {
    if (!isBedkom(ctx.user)) {
      throw new Error("Du har ikke tilgang til å gi prikker");
    }

    if (input.amount < 1) {
      throw new Error("Antall prikker tildelt må være større enn 0");
    }

    const user = await db.query.users.findFirst({
      where: (user) => eq(user.id, input.userId),
    });

    if (!user) {
      throw new Error("Fant ikke brukeren");
    }

    const happening = await db.query.happenings.findFirst({
      where: (happening) => and(eq(happening.id, input.happeningId), eq(happening.type, "bedpres")),
    });

    if (!happening) {
      throw new Error("Fant ikke bedriftspresentasjonen");
    }

    const bannableStrikeNumber =
      input.type === "NO_SHOW" ? 1 : getBannableStrikeNumber(input.currentAmount, input.amount);

    const data = {
      happeningId: happening.id,
      issuerId: ctx.user.id,
      reason: input.reason,
    } satisfies StrikeInfoInsert;

    await createStrikes(data, user.id, input.amount, bannableStrikeNumber);

    return "Prikker lagt til";
  });

export const unbanUser = authedAction.input(z.string()).create(async ({ input, ctx }) => {
  if (!isBedkom(ctx.user)) {
    throw new Error("Du har ikke tilgang til å fjerne utestengelser");
  }

  const user = await db
    .update(users)
    .set({ isBanned: false })
    .where(eq(users.id, input))
    .returning({ id: users.id })
    .then((res) => res[0] ?? null);

  if (!user) {
    throw new Error("Fikk ikke fjernet utestengelsen");
  }

  return "Brukeren er ikke lenger utestengt";
});
