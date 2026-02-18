"use server";

import { z } from "zod";

import { insertSiteFeedbackSchema } from "@echo-webkom/db/schemas";

import { auth } from "@/auth/session";
import { isWebkom } from "@/lib/memberships";
import { unoWithAdmin } from "../api/server";

const sendFeedbackPayloadSchema = insertSiteFeedbackSchema.pick({
  email: true,
  name: true,
  category: true,
  message: true,
});

export const sendFeedback = async (payload: z.infer<typeof sendFeedbackPayloadSchema>) => {
  try {
    const data = await sendFeedbackPayloadSchema.parseAsync(payload);

    await unoWithAdmin.siteFeedbacks.create(data);

    return {
      success: true,
      message: "Takk for tilbakemeldingen!",
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
};

export const toggleReadFeedback = async (id: string) => {
  const user = await auth();

  if (!user) {
    return {
      success: false,
      message: "Du er ikke logget inn",
    };
  }

  if (!isWebkom(user)) {
    return {
      success: false,
      message: "Du har ikke tilgang til denne funksjonen",
    };
  }

  try {
    const feedback = await unoWithAdmin.siteFeedbacks.getById(id);

    if (!feedback) {
      return {
        success: false,
        message: "Tilbakemeldingen finnes ikke.",
      };
    }

    await unoWithAdmin.siteFeedbacks.markAsSeen(id);

    return {
      success: true,
      message: "Tilbakemeldingen er oppdatert",
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
};
