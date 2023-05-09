import {z} from "zod";

export const registrationSchema = z.object({
  questions: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
    }),
  ),
});

export type RegistrationForm = z.infer<typeof registrationSchema>;
