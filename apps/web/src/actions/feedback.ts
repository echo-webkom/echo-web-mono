"use server";

import { z } from "zod";

import { insertSiteFeedbackSchema } from "@echo-webkom/db/schemas";

import { createFeedback, updateFeedback } from "@/data/site-feedbacks/mutations";
import { getFeedbackById } from "@/data/site-feedbacks/queries";
import { actionClient, groupActionClient } from "@/lib/safe-action";

const sendFeedbackPayloadSchema = insertSiteFeedbackSchema.pick({
  email: true,
  name: true,
  category: true,
  message: true,
});

export const sendFeedbackAction = actionClient
  .metadata({ actionName: "sendFeedback" })
  .schema(sendFeedbackPayloadSchema)
  .action(async ({ parsedInput }) => {
    const data = await sendFeedbackPayloadSchema.parseAsync(parsedInput);

    await createFeedback(data);

    return {
      success: true,
      message: "Takk for tilbakemeldingen!",
    };
  });

export const toggleReadFeedbackAction = groupActionClient(["webkom"])
  .metadata({ actionName: "toggleReadFeedback" })
  .schema(z.string())
  .action(async ({ parsedInput }) => {
    const id = parsedInput;
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
  });
