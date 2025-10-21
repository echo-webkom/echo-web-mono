import { z } from "zod";

import { feedbackCategoryEnum } from "@echo-webkom/db/schemas";

export const feedbackSchema = z.object({
  email: z
    .email({
      error: "Ikke en gyldig e-post.",
    })
    .or(z.literal(""))
    .optional(),
  name: z
    .string()
    .max(100, {
      error: "Navnet ditt er mer enn 100 bokstaver????",
    })
    .optional(),
  category: z.enum(feedbackCategoryEnum.enumValues, {
    error: () => "Du må velge en kategori.",
  }),
  message: z
    .string()
    .min(5, {
      error: "Tilbakemeldingen må være minst 5 bokstaver.",
    })
    .max(500, {
      error: "Tilbakemeldingen kan ikke være mer enn 500 bokstaver.",
    }),
});

export type FeedbackForm = z.infer<typeof feedbackSchema>;
