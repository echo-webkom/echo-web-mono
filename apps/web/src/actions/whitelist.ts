"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@echo-webkom/db";
import { whitelist } from "@echo-webkom/db/schemas";

import { webkomAction } from "@/lib/safe-actions";

export const upsertWhitelist = webkomAction
  .input(
    z.object({
      email: z.string(),
      reason: z.string(),
      days: z.number(),
    }),
  )
  .create(async ({ input }) => {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + input.days);

    const wasInWhitelist = await db.query.whitelist.findFirst({
      where: eq(whitelist.email, input.email),
    });

    await db
      .insert(whitelist)
      .values({
        email: input.email,
        expiresAt,
        reason: input.reason,
      })
      .onConflictDoUpdate({
        target: whitelist.email,
        set: {
          expiresAt: expiresAt,
          reason: input.reason,
        },
      });

    return wasInWhitelist ? "Brukeren ble oppdatert" : "Brukeren ble lagt til i whitelisten";
  });

export const removeWhitelist = webkomAction.input(z.string()).create(async ({ input }) => {
  await db.delete(whitelist).where(eq(whitelist.email, input));

  return "Brukeren ble fjernet fra whitelisten";
});
