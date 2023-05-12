import {z} from "zod";

export const deregistrationSchema = z.object({
  reason: z
    .string()
    .min(5, {message: "Må være minst 5 bokstaver"})
    .max(500, {message: "Må være maks 500 bokstaver"}),
  hasVerified: z.boolean().refine((v) => v, {message: "Må bekrefte"}),
});

export type DeregistrationForm = z.infer<typeof deregistrationSchema>;
