import { z } from "zod";

export const hyggkomListSchema = z.object({
  message: z
    .string()
    .min(1, { message: "Tilbakemeldingen må være minst 1 bokstaver." })
    .max(100, { message: "Tilbakemeldingen kan ikke være mer enn 100 bokstaver." }),
});

export type HyggkomListForm = z.infer<typeof hyggkomListSchema>;
