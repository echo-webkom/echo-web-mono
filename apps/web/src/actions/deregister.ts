"use server";

import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { getAuth } from "@echo-webkom/auth";
import { db } from "@echo-webkom/db";
import { answers, registrations } from "@echo-webkom/db/schemas";

import { automaticAddStrike, type StrikeType } from "./strikes";

const deregisterPayloadSchema = z.object({
  reason: z.string(),
});

export async function deregister(slug: string, payload: z.infer<typeof deregisterPayloadSchema>) {
  try {
    const user = await getAuth();

    if (!user) {
      return {
        success: false,
        message: "Du er ikke logget inn",
      };
    }

    const exisitingRegistration = await db.query.registrations.findFirst({
      where: (registration) =>
        and(eq(registration.happeningSlug, slug), eq(registration.userId, user.id)),
      with: {
        happening: {
          columns: {
            type: true,
            registrationEnd: true,
          },
        },
      },
    });

    if (!exisitingRegistration) {
      return {
        success: false,
        message: "Du er ikke påmeldt dette arrangementet",
      };
    }

    const data = await deregisterPayloadSchema.parseAsync(payload);

    await db
      .update(registrations)
      .set({
        status: "unregistered",
        unregisterReason: data.reason,
      })
      .where(and(eq(registrations.userId, user.id), eq(registrations.happeningSlug, slug)));
    await db
      .delete(answers)
      .where(and(eq(answers.userId, user.id), eq(answers.happeningSlug, slug)));

    if (exisitingRegistration.happening.type === "bedpres") {
      const now = new Date();
      const regEnd = exisitingRegistration.happening.registrationEnd;

      const strikeType: StrikeType =
        regEnd && regEnd < now ? "UNREGISTER_AFTER_DEADLINE" : "UNREGISTER_BEFORE_DEADLINE";

      await automaticAddStrike(exisitingRegistration.happeningSlug, user.id, strikeType);
    }

    return {
      success: true,
      message: "Du er nå avmeldt",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Tilbakemeldingen er ikke i riktig format",
      };
    }

    return {
      success: false,
      message: "En feil har oppstått",
    };
  }
}
