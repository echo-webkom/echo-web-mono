"use server";

import { z } from "zod";

import { createFeedback, updateFeedback } from "@/data/site-feedbacks/mutations";
import { getFeedbackById } from "@/data/site-feedbacks/queries";
import { getUser } from "@/lib/get-user";
import { isWebkom } from "@/lib/memberships";

const sendFeedbackPayloadSchema = z.object({
  name: z.string(),
  email: z.string(),
  category: z.enum(["bug", "feature", "login", "other"], {
    errorMap: () => ({ message: "Ugyldig kategori" }),
  }),
  message: z.string().min(1, "Melding må være minst 10 tegn"),
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
  const user = await getUser();

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
};
