import { z } from "zod";

export const bannerSchema = z.object({
  title: z.string(),
  subtitle: z.string().nullable(),
  link: z.string().nullable(),
});

export type StaticInfo = z.infer<typeof bannerSchema>;
