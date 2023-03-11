import { z } from "zod";

export const postSchema = z.object({
  _createdAt: z.string(),
  title: z.object({
    no: z.string(),
    en: z.string().nullable().optional(),
  }),
  slug: z.string(),
  body: z.object({
    no: z.string(),
    en: z.string().nullable().optional(),
  }),
  author: z.string(),
});
export type Post = z.infer<typeof postSchema>;
