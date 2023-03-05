import {z} from "zod";

export const profileSchema = z.object({
  name: z.string(),
  imageUrl: z.string().nullable(),
});
export type Profile = z.infer<typeof profileSchema>;
