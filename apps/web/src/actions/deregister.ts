"use server";

import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { auth } from "@echo-webkom/auth";
import { db } from "@echo-webkom/db";
import { answers, registrations } from "@echo-webkom/db/schemas";
import { DeregistrationNotificationEmail } from "@echo-webkom/email";
import { emailClient } from "@echo-webkom/email/client";

import { pingBoomtown } from "@/api/boomtown";
import { revalidateRegistrations } from "@/data/registrations/revalidate";
import { getContactsBySlug } from "@/sanity/utils/contacts";
import { shortDateNoYear } from "@/utils/date";

function registrationStatusToString(status: string) {
  if (status === "waiting") {
    return `Avmeldt fra venteliste ${shortDateNoYear(new Date())}`;
  } else if (status === "registered") {
    return `Avmeldt ${shortDateNoYear(new Date())}`;
  } else if (status === "removed") {
    return `Fjernet ${shortDateNoYear(new Date())}`;
  } else {
    return `Endret ${shortDateNoYear(new Date())}`;
  }
}

const deregisterPayloadSchema = z.object({
  reason: z.string(),
});

export async function deregister(id: string, payload: z.infer<typeof deregisterPayloadSchema>) {
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
          registrationChangedAt: registrationStatusToString(exisitingRegistration.status),
          status: "unregistered",
          unregisterReason: data.reason,
        })
        .where(and(eq(registrations.userId, user.id), eq(registrations.happeningId, id))),
      db.delete(answers).where(and(eq(answers.userId, user.id), eq(answers.happeningId, id))),
    ]);

    const contacts = await getContactsBySlug(exisitingRegistration.happening.slug);

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

    revalidateRegistrations(id, user.id);

    void (async () => {
      await pingBoomtown(id);
    })();

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
