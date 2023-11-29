import { z } from "zod";

export const registrationFormSchema = z.object({
  questions: z.array(
    z.object({
      questionId: z.string(),
      answer: z.string().or(z.string().array()).optional(),
    }),
  ),
});
