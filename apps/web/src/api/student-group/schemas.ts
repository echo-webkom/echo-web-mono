import { z } from "zod";
import { profileSchema } from "../profile/schemas";

export const memberSchema = z.object({
  role: z.string(),
  profile: profileSchema,
});
export type Member = z.infer<typeof memberSchema>;

export const studentGroupSchema = z.object({
  name: z.string(),
  slug: z.string(),
  info: z.string().nullable(),
  imageUrl: z.string().nullable(),
  members: z
    .array(memberSchema)
    .nullable()
    .transform((m) => m ?? []),
});
export type StudentGroup = z.infer<typeof studentGroupSchema>;

export const studentGroupTypeSchema = z.enum([
  "board",
  "suborg",
  "subgroup",
  "intgroup",
]);
export type StudentGroupType = z.infer<typeof studentGroupTypeSchema>;
