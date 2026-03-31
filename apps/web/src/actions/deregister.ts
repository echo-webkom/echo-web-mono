"use server";

import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { answers, registrations } from "@echo-webkom/db/schemas";
import { db } from "@echo-webkom/db/serverless";
import { DeregistrationNotificationEmail } from "@echo-webkom/email";
import { emailClient } from "@echo-webkom/email/client";

import { unoWithAdmin } from "@/api/server";
import { auth } from "@/auth/session";

const deregisterPayloadSchema = z.object({
  reason: z.string(),
});

export const deregister = async (id: string, payload: z.infer<typeof deregisterPayloadSchema>) => {
  try {
    const user = await auth();

    if (!user) {
      return {
        success: false,
        message: "Du er ikke logget inn",
      };
    }

    const exisitingRegistration = await db.query.registrations.findFirst({
      where: (registration) =>
        and(eq(registration.happeningId, id), eq(registration.userId, user.id)),
      with: {
        happening: true,
      },
    });

    if (!exisitingRegistration) {
      return {
        success: false,
        message: "Du er ikke påmeldt dette arrangementet",
      };
    }

    const data = await deregisterPayloadSchema.parseAsync(payload);

    await Promise.all([
      db
        .update(registrations)
        .set({
          prevStatus: exisitingRegistration.status,
          changedBy: null,
          status: "unregistered",
          unregisterReason: data.reason,
        })
        .where(and(eq(registrations.userId, user.id), eq(registrations.happeningId, id))),
      db.delete(answers).where(and(eq(answers.userId, user.id), eq(answers.happeningId, id))),
    ]);

    const contacts = await unoWithAdmin.sanity.happenings
      .contacts(exisitingRegistration.happening.slug)
      .catch(() => []);

    if (contacts.length > 0) {
      await emailClient.sendEmail(
        contacts.map((contact) => contact.email),
        `${user.name ?? "Ukjent"} har meldt seg av ${exisitingRegistration.happening.title}`,
        DeregistrationNotificationEmail({
          happeningTitle: exisitingRegistration.happening.title,
          name: user.name ?? "Ukjent",
          reason: data.reason,
        }),
      );
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

    console.error("failed to deregister", {
      error: error instanceof Error ? error.message : error,
    });

    return {
      success: false,
      message: "En feil har oppstått",
    };
  }
};
