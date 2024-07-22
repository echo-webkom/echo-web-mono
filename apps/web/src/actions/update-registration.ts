"use server";

import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@echo-webkom/db";
import { registrations, registrationStatusEnum } from "@echo-webkom/db/schemas";
import { GotSpotNotificationEmail } from "@echo-webkom/email";
import { emailClient } from "@echo-webkom/email/client";

import { revalidateRegistrations } from "@/data/registrations/revalidate";
import { isHost } from "@/lib/memberships";
import { groupActionClient } from "@/lib/safe-action";

const updateRegistrationSchema = z.object({
  happeningId: z.string(),
  registrationUserId: z.string(),
  status: z.enum(registrationStatusEnum.enumValues),
  reason: z.string(),
});

export const updateRegistrationAction = groupActionClient(["bedkom", "webkom"])
  .metadata({ actionName: "updateRegistration" })
  .schema(updateRegistrationSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { happeningId, registrationUserId, status, reason } = parsedInput;
    const { user } = ctx;

    const exisitingRegistration = await db.query.registrations.findFirst({
      where: (registration) =>
        and(eq(registration.happeningId, happeningId), eq(registration.userId, registrationUserId)),
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
      return {
        success: false,
        message: "Denne personen er ikke påmeldt arrangementet",
      };
    }

    if (!isHost(user, exisitingRegistration.happening)) {
      return {
        success: false,
        message: "Du kan ikke endre påmeldingen til en arrangør",
      };
    }

    await db
      .update(registrations)
      .set({
        prevStatus: exisitingRegistration.status,
        changedBy: user.id,
        changedAt: new Date(),
        status,
        unregisterReason: reason,
      })
      .where(
        and(
          eq(registrations.userId, registrationUserId),
          eq(registrations.happeningId, happeningId),
        ),
      );

    if (status === "registered") {
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

    revalidateRegistrations(happeningId, user.id);

    return {
      success: true,
      message: "Påmeldingen er endret",
    };
  });
