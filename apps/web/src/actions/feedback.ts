"use server";

import { z } from "zod";

import { insertSiteFeedbackSchema } from "@echo-webkom/db/schemas";

import { createFeedback, updateFeedback } from "@/data/site-feedbacks/mutations";
import { getFeedbackById } from "@/data/site-feedbacks/queries";

const sendFeedbackPayloadSchema = insertSiteFeedbackSchema.pick({
  email: true,
  name: true,
  category: true,
  message: true,
});

export async function sendFeedback(payload: z.infer<typeof sendFeedbackPayloadSchema>) {
  try {
    const data = await sendFeedbackPayloadSchema.parseAsync(payload);

    await createFeedback(data);

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
}

export async function toggleReadFeedback(id: string) {
  try {
    const feedback = await getFeedbackById(id);

    if (!feedback) {
      return {
        success: false,
        message: "Tilbakemeldingen finnes ikke.",
      };
    }

    await updateFeedback(id, {
      isRead: !feedback.isRead,
    });

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
}
