"use server";

import { eq } from "drizzle-orm";

import { insertWhitelistSchema, whitelist } from "@echo-webkom/db/schemas";
import { db } from "@echo-webkom/db/serverless";

import { getUser } from "@/lib/get-user";
import { isMemberOf } from "@/lib/memberships";

export const upsertWhitelist = async (email: string, reason: string, days: number) => {
  try {
    const user = await getUser();

    if (!user) {
      return {
        success: false,
        message: "Du er ikke logget inn",
      };
    }

    if (!isMemberOf(user, ["webkom", "hovedstyret"])) {
      return {
        success: false,
        message: "Du har ikke tilgang til denne funksjonen",
      };
    }

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
  try {
    const user = await getUser();

    if (!user) {
      return {
        success: false,
        message: "Du er ikke logget inn",
      };
    }

    if (!isMemberOf(user, ["webkom", "hovedstyret"])) {
      return {
        success: false,
        message: "Du har ikke tilgang til denne funksjonen",
      };
    }

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
