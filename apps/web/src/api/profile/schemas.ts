import {z} from "zod";

export const profileSchema = z.object({
  _id: z.string(),
  name: z.string(),
  imageUrl: z.string().nullable(),
  socials: z.object({
    email: z.string().optional(),
    linkedin: z.string().optional(),
  }),
});
export type Profile = z.infer<typeof profileSchema>;

export const contactProfileSchema = z.object({
  email: z.string(),
  profile: profileSchema.pick({_id: true, name: true}),
});
export type ContactProfile = z.infer<typeof contactProfileSchema>;
