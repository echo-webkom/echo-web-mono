import { z } from "zod";

export const degreeFormSchema = z.object({
  id: z.string().min(1).max(255),
  name: z.string().min(1).max(255),
  action: z.union([z.literal("create"), z.literal("update")]),
});
export type DegreeForm = z.infer<typeof degreeFormSchema>;
