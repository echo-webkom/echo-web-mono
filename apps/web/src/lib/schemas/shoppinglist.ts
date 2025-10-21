import { z } from "zod";

export const hyggkomListSchema = z.object({
  name: z
    .string()
    .min(2, {
      error: "Tilbakemeldingen må være minst 2 bokstaver.",
    })
    .max(80, {
      error: "Tilbakemeldingen kan ikke være mer enn 80 bokstaver.",
    }),
});

export type HyggkomListForm = z.infer<typeof hyggkomListSchema>;
