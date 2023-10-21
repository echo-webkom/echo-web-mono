"use server";

import { z } from "zod";

import { db } from "@echo-webkom/db";
import { insertSiteFeedbackSchema, siteFeedback } from "@echo-webkom/db/schemas";

const sendFeedbackPayloadSchema = insertSiteFeedbackSchema.pick({
  email: true,
  name: true,
  message: true,
});

export async function sendFeedback(payload: z.infer<typeof sendFeedbackPayloadSchema>) {
  try {
    const data = await sendFeedbackPayloadSchema.parseAsync(payload);

    const feedback = await db
      .insert(siteFeedback)
      .values({
        ...data,
      })
      .returning()
      .then((res) => res[0] ?? null);

    if (!feedback) {
      return {
        success: false,
        message: "Fikk ikke til å sende tilbakemeldingen",
      };
    }

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
