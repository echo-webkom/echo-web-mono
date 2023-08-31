import { z } from "zod";

export const questionSchema = z.object({
  title: z.string(),
  required: z.boolean(),
  type: z.enum(["text", "multipleChoice"]),
  options: z.string().array().nullable(),
});
export type Question = z.infer<typeof questionSchema>;
