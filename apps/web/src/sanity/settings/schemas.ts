import { z } from "zod";

export const bannerSchema = z.object({
  showBanner: z.boolean(),
  title: z.string(),
  subtitle: z.string().nullable(),
  link: z.string().nullable(),
});

export type Banner = z.infer<typeof bannerSchema>;
