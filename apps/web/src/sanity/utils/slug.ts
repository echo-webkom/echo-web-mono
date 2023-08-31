import { z } from "zod";

export const slugSchema = z.object({
  slug: z.string(),
});
export type Slug = z.infer<typeof slugSchema>;
