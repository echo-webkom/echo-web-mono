import {z} from "zod";

export const postSchema = z.object({
  _id: z.string(),
  _createdAt: z.string(),
  _updatedAt: z.string(),
  title: z.string(),
  slug: z.string(),
  authors: z
    .object({
      _id: z.string(),
      name: z.string(),
    })
    .array(),
  imageUrl: z.string().nullable(),
  body: z.string(),
});
export type Post = z.infer<typeof postSchema>;
