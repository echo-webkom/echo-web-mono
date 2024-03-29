import { z } from "zod";

import { imageSchema } from "../utils/image";

export const profileSchema = z.object({
  _id: z.string(),
  name: z.string(),
  picture: imageSchema.nullable(),
  socials: z
    .object({
      email: z.string().optional(),
      linkedin: z.string().optional(),
    })
    .nullable(),
});

export const contactProfileSchema = z.object({
  email: z.string(),
  profile: profileSchema.pick({ _id: true, name: true }),
});

export type Profile = z.infer<typeof profileSchema>;
export type ContactProfile = z.infer<typeof contactProfileSchema>;
