"use server";

import { eq } from "drizzle-orm";

import { auth } from "@echo-webkom/auth";
import { db } from "@echo-webkom/db";
import { insertWhitelistSchema, whitelist } from "@echo-webkom/db/schemas";

import { isWebkom } from "@/lib/memberships";

export async function upsertWhitelist(email: string, reason: string, days: number) {
  try {
    const user = await auth();

    if (!user) {
      return {
        success: false,
        message: "Du er ikke logget inn",
      };
    }

    if (!isWebkom(user)) {
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
  } catch (e) {
    return {
      success: false,
      message: "Noe gikk galt",
    };
  }
}

export async function removeWhitelist(email: string) {
  try {
    const user = await auth();

    if (!user) {
      return {
        success: false,
        message: "Du er ikke logget inn",
      };
    }

    if (!isWebkom(user)) {
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
  } catch (e) {
    return {
      success: false,
      message: "Noe gikk galt",
    };
  }
}
