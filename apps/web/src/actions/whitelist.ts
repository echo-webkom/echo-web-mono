"use server";

import { eq } from "drizzle-orm";

import { insertWhitelistSchema, whitelist } from "@echo-webkom/db/schemas";
import { db } from "@echo-webkom/db/serverless";

import { checkAuthorization } from "@/utils/server-action-helpers";

export const upsertWhitelist = async (email: string, reason: string, days: number) => {
  const authError = await checkAuthorization({ requiredGroups: ["webkom", "hovedstyret"] });
  if (authError) return authError;

  try {
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
  } catch {
    return {
      success: false,
      message: "Noe gikk galt",
    };
  }
};

export const removeWhitelist = async (email: string) => {
  const authError = await checkAuthorization({ requiredGroups: ["webkom", "hovedstyret"] });
  if (authError) return authError;

  try {
    await db.delete(whitelist).where(eq(whitelist.email, email));

    return {
      success: true,
      message: "Brukeren ble fjernet fra whitelisten",
    };
  } catch {
    return {
      success: false,
      message: "Noe gikk galt",
    };
  }
};
