"use server";

import { z } from "zod";

import { insertSiteFeedbackSchema } from "@echo-webkom/db/schemas";

import { createFeedback, updateFeedback } from "@/data/site-feedbacks/mutations";
import { getFeedbackById } from "@/data/site-feedbacks/queries";
import { checkAuthorization, handleActionError } from "@/utils/server-action-helpers";
import { isWebkom } from "@/lib/memberships";

const sendFeedbackPayloadSchema = insertSiteFeedbackSchema.pick({
  email: true,
  name: true,
  category: true,
  message: true,
});

export const sendFeedback = async (payload: z.infer<typeof sendFeedbackPayloadSchema>) => {
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
};

export const toggleReadFeedback = async (id: string) => {
  const authError = await checkAuthorization({ customCheck: (user) => isWebkom(user) });
  if (authError) return authError;

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
    return handleActionError(error);
  }
};
