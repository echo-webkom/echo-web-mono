import {z} from "zod";

export const bannerSchema = z.object({
  title: z.string(),
  subtitle: z.string().nullable(),
  expiresAt: z.string().nullable(),
  link: z.string().nullable(),
});
export type Banner = z.infer<typeof bannerSchema>;
