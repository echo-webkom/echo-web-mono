import {z} from "zod";

export const postSchema = z.object({
  title: z.object({
    no: z.string(),
    en: z.string().nullable().optional(),
  }),
  slug: z.string(),
  body: z.object({
    no: z.string(),
    en: z.string().nullable().optional(),
  }),
  author: z
    .object({
      name: z.string(),
    })
    .transform((a) => a.name),
  _createdAt: z.string(),
});
export type Post = z.infer<typeof postSchema>;
