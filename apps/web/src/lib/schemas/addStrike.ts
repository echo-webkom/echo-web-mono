import { z } from "zod";

export const addStrikesSchema = z.object({
  happeningId: z.string().trim().min(1, {
    error: "Du må velge en bedriftspresentasjon",
  }),
  amount: z
    .number()
    .gte(1, {
      error: "Du må gi minst 1 prikk",
    })
    .lte(5, {
      error: "Du kan maks gi 5 prikker om gangen",
    }),
  reason: z
    .string()
    .trim()
    .min(5, {
      error: "Du må skrive en begrunnelse på minst 5 bokstaver",
    })
    .max(500, {
      error: "Begrunnelsen kan ikke være mer enn 500 bokstaver",
    }),
  hasVerified: z.literal<boolean>(true),
});

export type AddStrikeForm = z.infer<typeof addStrikesSchema>;
