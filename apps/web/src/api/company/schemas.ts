import {z} from "zod";

export const companySchema = z.object({
  _id: z.string(),
  name: z.string(),
  website: z.string(),
  imageUrl: z.string(),
  description: z.string(),
});
