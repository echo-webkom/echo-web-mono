"use server";

import { eq } from "drizzle-orm";

import { db } from "@echo-webkom/db";
import { strikes } from "@echo-webkom/db/schemas";

export type StrikeType =
  | "UNREGISTER_BEFORE_DEADLINE"
  | "UNREGISTER_AFTER_DEADLINE"
  | "NO_SHOW"
  | "WRONG_INFO"
  | "TOO_LATE"
  | "NO_FEEDBACK"
  | "OTHER";

export const STRIKE_TYPE_MESSAGE: Record<StrikeType, string> = {
  UNREGISTER_BEFORE_DEADLINE: "Du har meldt deg av før påmeldingsfristen",
  UNREGISTER_AFTER_DEADLINE: "Du har meldt deg av etter påmeldingsfristen",
  NO_SHOW: "Du har ikke møtt opp",
  WRONG_INFO: "Du har gitt feil informasjon",
  TOO_LATE: "Du har meldt deg av for sent",
  NO_FEEDBACK: "Du har ikke gitt tilbakemelding",
  OTHER: "Annet",
} as const;

export const STRIKE_TYPE_POINTS: Record<StrikeType, number | null> = {
  UNREGISTER_BEFORE_DEADLINE: 1,
  UNREGISTER_AFTER_DEADLINE: 2,
  NO_SHOW: 1, // and excluded from next three eligable happenings
  WRONG_INFO: 1,
  TOO_LATE: 1,
  NO_FEEDBACK: 1,
  OTHER: null,
} as const;

export async function addStrike(
  happeningSlug: string,
  userId: string,
  type: StrikeType,
  reason: string,
) {
  try {
    const happening = await db.query.happenings.findFirst({
      where: (happening) => eq(happening.slug, happeningSlug),
    });

    if (!happening) {
      return {
        success: false,
        message: "Arrangementet finnes ikke",
      };
    }

    const user = await db.query.users.findFirst({
      where: (user) => eq(user.id, userId),
    });

    if (!user) {
      return {
        success: false,
        message: "Brukeren finnes ikke",
      };
    }

    const data = {
      userId: user.id,
      happeningSlug: happening.slug,
      reason,
      type,
    };

    await db
      .insert(strikes)
      .values(data)
      .onConflictDoUpdate({
        set: {
          reason: data.reason,
        },
        target: [strikes.userId, strikes.happeningSlug],
      });

    return {
      success: true,
      message: "Strike lagt til",
    };
  } catch {
    return {
      success: false,
      message: "En feil har oppstått",
    };
  }
}
