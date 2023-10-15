import { z } from "zod";

export const editRegistrationSchema = z.object({
  status: z
    .string(),
  hasVerified: z.boolean().refine((v) => v, { message: "Må bekrefte" }),
});

export type editRegistrationForm = z.infer<typeof editRegistrationSchema>;
