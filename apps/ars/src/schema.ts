import { z } from "zod";

export const registerJsonSchema = z.object({
  userId: z.string(),
  happeningId: z.string(),
  questions: z.array(
    z.object({
      questionId: z.string(),
      answer: z.string().or(z.string().array()).optional(),
    }),
  ),
});

export type RegisterJson = z.infer<typeof registerJsonSchema>;
