"use server";

import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@echo-webkom/db";
import { registrations, registrationStatusEnum } from "@echo-webkom/db/schemas";
import { GotSpotNotificationEmail } from "@echo-webkom/email";
import { emailClient } from "@echo-webkom/email/client";

import { revalidateRegistrations } from "@/data/registrations/revalidate";
import { isHost } from "@/lib/memberships";
import { authedAction } from "@/lib/safe-actions";
import { shortDateNoYear } from "@/utils/date";

function registrationStatusToString(oldStatus: string, newStatus: string) {
  const status =
    oldStatus === "waiting" ? "venteliste" : oldStatus === "registered" ? "påmeldt" : "avmeldt";
  if (oldStatus === "waiting" && newStatus === "registered") {
    return `Flyttet fra venteliste ${shortDateNoYear(new Date())}`;
  } else if (newStatus === "removed") {
    return `Fjernet ${shortDateNoYear(new Date())}`;
  } else {
    return `Flyttet fra ${status} ${shortDateNoYear(new Date())}`;
  }
}

export const updateRegistration = authedAction
  .input(
    z.object({
      happeningId: z.string(),
      registrationUserId: z.string(),
      registration: z.object({
        status: z.enum(registrationStatusEnum.enumValues),
        reason: z.string(),
      }),
    }),
  )
  .create(async ({ input, ctx }) => {
    const exisitingRegistration = await db.query.registrations.findFirst({
      where: (registration) =>
        and(
          eq(registration.happeningId, input.happeningId),
          eq(registration.userId, input.registrationUserId),
        ),
      with: {
        happening: {
          with: {
            groups: true,
          },
        },
        user: true,
      },
    });

    if (!exisitingRegistration) {
      throw new Error("Denne personen er ikke påmeldt arrangementet");
    }

    if (!isHost(ctx.user, exisitingRegistration.happening)) {
      throw new Error("Du kan ikke endre påmeldingen til en arrangør");
    }

    await db
      .update(registrations)
      .set({
        registrationChangedAt: registrationStatusToString(
          exisitingRegistration.status,
          input.registration.status,
        ),
        status: input.registration.status,
        unregisterReason: input.registration.reason,
      })
      .where(
        and(
          eq(registrations.userId, input.registrationUserId),
          eq(registrations.happeningId, input.happeningId),
        ),
      );

    if (input.registration.status === "registered") {
      const sendTo =
        exisitingRegistration.user.alternativeEmail ?? exisitingRegistration.user.email;

      await emailClient.sendEmail(
        [sendTo],
        "Du har fått plass!",
        GotSpotNotificationEmail({
          happeningTitle: exisitingRegistration.happening.title,
          name: exisitingRegistration.user.name ?? exisitingRegistration.user.email,
        }),
      );
    }

    revalidateRegistrations(input.happeningId, input.registrationUserId);

    return "Påmeldingen er endret";
  });
