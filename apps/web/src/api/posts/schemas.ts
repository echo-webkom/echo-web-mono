import {z} from "zod";

import {localeMarkdownSchema, localeStringSchema} from "../utils/locale";

export const postSchema = z.object({
  _id: z.string(),
  _createdAt: z.string(),
  _updatedAt: z.string(),
  title: localeStringSchema,
  slug: z.string(),
  authors: z
    .object({
      _id: z.string(),
      name: z.string(),
    })
    .array(),
  imageUrl: z.string().nullable(),
  body: localeMarkdownSchema,
});
export type Post = z.infer<typeof postSchema>;
