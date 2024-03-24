import { z } from "zod";

import { imageSchema } from "../utils/image";

export const moviesSchema = z.object({
  _id: z.string(),
  title: z.string(),
  date: z.string(),
  link: z.string(),
  image: imageSchema,
});

export type Movies = z.infer<typeof moviesSchema>;
