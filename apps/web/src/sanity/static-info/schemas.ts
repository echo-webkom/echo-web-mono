import { z } from "zod";

export const staticInfoSchema = z.object({
  title: z.string(),
  slug: z.string(),
  pageType: z.enum(["about", "for-students", "for-companies"]),
  body: z.string(),
});

export type StaticInfo = z.infer<typeof staticInfoSchema>;
