import {z} from "zod";

export const feedbackInput = z.object({
  email: z.string().email().or(z.literal("")).optional(),
  name: z.string().max(100).optional(),
  message: z.string().min(5).max(500),
});
export type FeedbackInput = z.infer<typeof feedbackInput>;
