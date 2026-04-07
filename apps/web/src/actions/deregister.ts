"use server";

import { z } from "zod";

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

    const exisitingRegistration = await unoWithAdmin.happenings.registrationByUser(id, user.id);

    if (!exisitingRegistration) {
      return {
        success: false,
        message: "Du er ikke påmeldt dette arrangementet",
      };
    }

    const data = await deregisterPayloadSchema.parseAsync(payload);

    await unoWithAdmin.happenings.deregister(id, user.id, data.reason);

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
