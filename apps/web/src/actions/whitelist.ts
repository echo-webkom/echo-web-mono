"use server";

import { insertWhitelistSchema } from "@echo-webkom/db/schemas";

import { unoWithAdmin } from "@/api/server";
import { auth } from "@/auth/session";
import { isMemberOf } from "@/lib/memberships";

export const upsertWhitelist = async (email: string, reason: string, days: number) => {
  try {
    const user = await auth();

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

    const wasInWhitelist = await unoWithAdmin.whitelist.getByEmail(email);
    await unoWithAdmin.whitelist.upsert(data);

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
    const user = await auth();

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

    await unoWithAdmin.whitelist.remove(email);

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
