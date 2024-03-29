import { z } from "zod";

import { profileSchema } from "../profile/schemas";
import { imageSchema } from "../utils/image";

export const studentGroupTypes = [
  "board",
  "suborg",
  "subgroup",
  "intgroup",
  "sport",
  "hidden",
] as const;

export const studentGroupTypeSchema = z.enum(studentGroupTypes);

export const memberSchema = z.object({
  role: z.string(),
  profile: profileSchema.pick({ _id: true, name: true, picture: true, socials: true }),
});

export const studentGroupSchema = z.object({
  _id: z.string(),
  _createdAt: z.string(),
  _updatedAt: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  groupType: studentGroupTypeSchema,
  image: imageSchema.nullable(),
  members: memberSchema.array().nullable(),
  socials: z
    .object({
      facebook: z.string().nullable(),
      instagram: z.string().nullable(),
      linkedin: z.string().nullable(),
      email: z.string().nullable(),
    })
    .nullable(),
});

export const studentGroupSlugSchema = z.object({
  slug: z.string(),
  groupType: z.enum(studentGroupTypes),
});

export type Member = z.infer<typeof memberSchema>;
export type StudentGroupType = z.infer<typeof studentGroupTypeSchema>;
export type StudentGroup = z.infer<typeof studentGroupSchema>;
