import { z } from "zod";

export const addStrikesSchema = z.object({
  happeningId: z.string({ required_error: "Du må velge et bedriftspresentasjon" }),
  amount: z
    .string()
    .min(1, { message: "Du må gi minst 1 prikk" })
    .max(10, { message: "Du kan maks gi 10 prikker om gangen" }),
  reason: z
    .string()
    .min(5, { message: "Du må skrive en begrunnelse på minst 5 bokstaver" })
    .max(500, { message: "Begrunnelsen kan ikke være mer enn 500 bokstaver" }),
  hasVerified: z.literal<boolean>(true, {
    required_error: "Du må bekrefte at du er kjent med Bedkom sine retningslinjer for prikker",
  }),
});

export type AddStrikeForm = z.infer<typeof addStrikesSchema>;
