import {z} from "zod";

export const colorSchema = z.object({
  hex: z.string(),
});

export const bannerSchema = z.object({
  color: colorSchema.transform((c) => c.hex),
  textColor: colorSchema.transform((c) => c.hex),
  text: z.string(),
  linkTo: z.string().nullable(),
  isExternal: z.boolean(),
});
export type Banner = z.infer<typeof bannerSchema>;
