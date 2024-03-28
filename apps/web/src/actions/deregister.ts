"use server";

import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@echo-webkom/db";
import { answers, registrations } from "@echo-webkom/db/schemas";
import { DeregistrationNotificationEmail } from "@echo-webkom/email";
import { emailClient } from "@echo-webkom/email/client";

import { pingBoomtown } from "@/api/boomtown";
import { revalidateRegistrations } from "@/data/registrations/revalidate";
import { authedAction } from "@/lib/safe-actions";
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

export const deregister = authedAction
  .input(
    z.object({
      id: z.string(),
      reason: z.string(),
    }),
  )
  .create(async ({ input, ctx }) => {
    const { id, reason } = input;
    const { user } = ctx;

    const exisitingRegistration = await db.query.registrations.findFirst({
      where: (registration) =>
        and(eq(registration.happeningId, id), eq(registration.userId, user.id)),
      with: {
        happening: true,
      },
    });

    if (!exisitingRegistration) {
      throw new Error("Fant ikke registreringen");
    }

    await Promise.all([
      db
        .update(registrations)
        .set({
          registrationChangedAt: registrationStatusToString(exisitingRegistration.status),
          status: "unregistered",
          unregisterReason: reason,
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
          reason,
        }),
      );
    }

    revalidateRegistrations(id, user.id);

    void (async () => {
      await pingBoomtown(id);
    })();

    return "Du er nå avmeldt";
  });
