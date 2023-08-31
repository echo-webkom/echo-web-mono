import { z } from "zod";

/**
 * Schema to validate Sanity image objects.
 */
export const imageSchema = z.object({
  _type: z.literal("image"),
  asset: z.object({
    _ref: z.string(),
    _type: z.literal("reference"),
  }),
  crop: z
    .object({
      _type: z.literal("sanity.imageCrop"),
      bottom: z.number(),
      left: z.number(),
      right: z.number(),
      top: z.number(),
    })
    .optional(),
  hotspot: z
    .object({
      _type: z.literal("sanity.imageHotspot"),
      height: z.number(),
      width: z.number(),
      x: z.number(),
      y: z.number(),
    })
    .optional(),
  caption: z.string().optional(),
});
