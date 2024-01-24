"use server";

import { z } from "zod";

import { insertSiteFeedbackSchema } from "@echo-webkom/db/schemas";

import { createFeedback } from "@/data/site-feedbacks/mutations";

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
