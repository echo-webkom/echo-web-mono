import { z } from "zod";

export const staticInfoSchema = z.object({
  title: z.string(),
  slug: z.string(),
  pageType: z.enum(["ABOUT", "STUDENTS", "COMPANIES"]),
  body: z.string(),
});

export type StaticInfo = z.infer<typeof staticInfoSchema>;
