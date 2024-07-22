"use server";

import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@echo-webkom/db";
import { answers, registrations } from "@echo-webkom/db/schemas";
import { DeregistrationNotificationEmail } from "@echo-webkom/email";
import { emailClient } from "@echo-webkom/email/client";

import { pingBoomtown } from "@/api/boomtown";
import { revalidateRegistrations } from "@/data/registrations/revalidate";
import { authActionClient } from "@/lib/safe-action";
import { getContactsBySlug } from "@/sanity/utils/contacts";

const deregisterPayloadSchema = z.object({
  id: z.string(),
  reason: z.string(),
});

export const deregisterAction = authActionClient
  .metadata({ actionName: "deregister" })
  .schema(deregisterPayloadSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { id, reason } = parsedInput;
    const { user } = ctx;

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

    await Promise.all([
      db
        .update(registrations)
        .set({
          prevStatus: exisitingRegistration.status,
          changedBy: null,
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
          reason: reason,
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
  });
