"use server";

import { z } from "zod";

import { insertSiteFeedbackSchema } from "@echo-webkom/db/schemas";

import { createFeedback } from "@/data/site-feedbacks/mutations";
import { getFeedbackById } from "@/data/site-feedbacks/queries";
import { publicAction, webkomAction } from "@/lib/safe-actions";

const sendFeedbackPayloadSchema = insertSiteFeedbackSchema.pick({
  email: true,
  name: true,
  category: true,
  message: true,
});

export const sendFeedback = publicAction
  .input(sendFeedbackPayloadSchema)
  .create(async ({ input }) => {
    await createFeedback(input);

    return "Takk for din tilbakemelding!";
  });

export const toggleReadFeedback = webkomAction.input(z.string()).create(async ({ input }) => {
  const feedback = await getFeedbackById(input);

  if (!feedback) {
    throw new Error("Fant ikke tilbakemeldingen");
  }

  return "Tilbakemeldingen ble markert som lest";
});
