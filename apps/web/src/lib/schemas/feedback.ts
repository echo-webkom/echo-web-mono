import { z } from "zod";

import { feedbackCategoryEnum } from "@echo-webkom/db/schemas";

export const feedbackSchema = z.object({
  email: z.string().email({ message: "Ikke en gyldig e-post." }).or(z.literal("")).optional(),
  name: z.string().max(100, { message: "Navnet ditt er mer enn 100 bokstaver????" }).optional(),
  category: z.enum(feedbackCategoryEnum.enumValues, {
    errorMap: () => ({ message: "Du må velge en kategori." }),
  }),
  message: z
    .string()
    .min(5, { message: "Tilbakemeldingen må være minst 5 bokstaver." })
    .max(500, { message: "Tilbakemeldingen kan ikke være mer enn 500 bokstaver." }),
});

export type FeedbackForm = z.infer<typeof feedbackSchema>;
