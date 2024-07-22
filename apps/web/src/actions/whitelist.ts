"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@echo-webkom/db";
import { insertWhitelistSchema, whitelist } from "@echo-webkom/db/schemas";

import { groupActionClient } from "@/lib/safe-action";

export const upsertWhitelistAction = groupActionClient(["hovedstyret", "webkom"])
  .metadata({ actionName: "upsertWhitelist" })
  .schema(
    z.object({
      email: z.string().email(),
      reason: z.string(),
      days: z.number(),
    }),
  )
  .action(async ({ parsedInput }) => {
    const { email, reason, days } = parsedInput;

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + days);

    const data = insertWhitelistSchema.parse({
      email,
      reason,
      expiresAt,
    });

    const wasInWhitelist = await db.query.whitelist.findFirst({
      where: eq(whitelist.email, email),
    });

    await db
      .insert(whitelist)
      .values(data)
      .onConflictDoUpdate({
        target: whitelist.email,
        set: {
          expiresAt: data.expiresAt,
          reason: data.reason,
        },
      });

    return {
      success: true,
      message: wasInWhitelist ? "Brukeren ble oppdatert" : "Brukeren ble lagt til i whitelisten",
    };
  });

export const removeWhitelistAction = groupActionClient(["hovedstyret", "webkom"])
  .metadata({ actionName: "removeWhitelist" })
  .schema(z.object({ email: z.string().email() }))
  .action(async ({ parsedInput }) => {
    const { email } = parsedInput;

    await db.delete(whitelist).where(eq(whitelist.email, email));

    return {
      success: true,
      message: "Brukeren ble fjernet fra whitelisten",
    };
  });
