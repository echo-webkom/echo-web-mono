import { z } from "zod";

import { imageSchema } from "../utils/image";

export const authorSchema = z.object({
  _id: z.string(),
  name: z.string(),
  image: imageSchema.nullable(),
});
export type Author = z.infer<typeof authorSchema>;

export const postSchema = z.object({
  _id: z.string(),
  _createdAt: z.string(),
  _updatedAt: z.string(),
  title: z.string(),
  slug: z.string(),
  authors: authorSchema.array().nullable(),
  image: imageSchema.nullable(),
  body: z.string(),
});
export type Post = z.infer<typeof postSchema>;
