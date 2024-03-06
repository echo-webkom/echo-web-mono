"use server";

import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { auth } from "@echo-webkom/auth";
import { db } from "@echo-webkom/db";
import { registrations, registrationStatusEnum } from "@echo-webkom/db/schemas";
import { GotSpotNotificationEmail } from "@echo-webkom/email";
import { emailClient } from "@echo-webkom/email/client";

import { revalidateRegistrations } from "@/data/registrations/revalidate";
import { isHost } from "@/lib/memberships";
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

const updateRegistrationPayloadSchema = z.object({
  status: z.enum(registrationStatusEnum.enumValues),
  reason: z.string(),
});

export async function updateRegistration(
  happeningId: string,
  registrationUserId: string,
  payload: z.infer<typeof updateRegistrationPayloadSchema>,
) {
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

    const data = await updateRegistrationPayloadSchema.parseAsync(payload);

    await db
      .update(registrations)
      .set({
        registrationChangedAt: registrationStatusToString(
          exisitingRegistration.status,
          data.status,
        ),
        status: data.status,
        unregisterReason: data.reason,
      })
      .where(
        and(
          eq(registrations.userId, registrationUserId),
          eq(registrations.happeningId, happeningId),
        ),
      );

    if (data.status === "registered") {
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
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Grunnen er ikke i riktig format",
      };
    }
    return {
      success: false,
      message: "En feil har oppstått",
    };
  }
}
