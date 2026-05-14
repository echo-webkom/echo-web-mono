"use server";

import { registrationStatusEnum } from "@echo-webkom/db/schemas";
import { z } from "zod";

import { unoWithAdmin } from "@/api/server";
import { auth } from "@/auth/session";
import { isHost } from "@/lib/memberships";

const updateRegistrationPayloadSchema = z.object({
  status: z.enum(registrationStatusEnum.enumValues),
  reason: z.string(),
});

export const updateRegistration = async (
  happeningId: string,
  registrationUserId: string,
  payload: z.infer<typeof updateRegistrationPayloadSchema>,
) => {
  try {
    const user = await auth();

    if (!user) {
      return {
        success: false,
        message: "Du er ikke logget inn",
      };
    }

    const happening = await unoWithAdmin.happenings.byId(happeningId);
    const fullHappening = await unoWithAdmin.happenings.full(happening.slug);
    const exisitingRegistration = fullHappening?.registrations.find(
      (registration) => registration.userId === registrationUserId,
    );

    if (!exisitingRegistration) {
      return {
        success: false,
        message: "Denne personen er ikke påmeldt arrangementet",
      };
    }

    const groups = fullHappening?.groups ?? [];
    if (!isHost(user, groups)) {
      return {
        success: false,
        message: "Du kan ikke endre påmeldingen til en arrangør",
      };
    }

    const data = updateRegistrationPayloadSchema.parse(payload);

    await unoWithAdmin.happenings.updateRegistration(happeningId, registrationUserId, {
      status: data.status,
      reason: data.reason,
      changedBy: user.id,
    });

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
};
