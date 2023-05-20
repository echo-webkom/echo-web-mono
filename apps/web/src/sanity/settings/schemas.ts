import {z} from "zod";

export const bannerSchema = z.object({
  title: z.string().nullable(),
  subtitle: z.string().nullable(),
  expiresAt: z.string().nullable(),
  link: z.string().nullable(),
});
export type Banner = z.infer<typeof bannerSchema>;

export const bannerSettingsSchema = z.object({
  showBanner: z.boolean(),
  banner: bannerSchema.nullable(),
});
export type BannerSettings = z.infer<typeof bannerSettingsSchema>;

export const footerSectionSchema = z.object({
  title: z.string(),
  links: z.array(
    z.object({
      title: z.string(),
      link: z.string(),
    }),
  ),
});

export type FooterSection = z.infer<typeof footerSectionSchema>;
