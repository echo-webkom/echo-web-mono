import {z} from "zod";

export const bannerSchema = z.object({
  title: z.string().nullable(),
  subtitle: z.string().nullable(),
  expiresAt: z.string().nullable(),
  link: z.string().nullable(),
});
export type Banner = z.infer<typeof bannerSchema>;

export const siteSettingsSchema = z.object({
  showBanner: z.boolean(),
  banner: bannerSchema.nullable(),
});
export type SiteSettings = z.infer<typeof siteSettingsSchema>;
