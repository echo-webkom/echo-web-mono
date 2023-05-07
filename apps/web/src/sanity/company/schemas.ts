import {z} from "zod";

import {imageSchema} from "../utils/image";

export const companySchema = z.object({
  _id: z.string(),
  name: z.string(),
  website: z.string(),
  image: imageSchema,
  description: z.string(),
});
