import { z } from "zod";

export const staticInfoSchema = z.object({
  name: z.string(),
  slug: z.string(),
  info: z.string(),
});
export type StaticInfo = z.infer<typeof staticInfoSchema>;
