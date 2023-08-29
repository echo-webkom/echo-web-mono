import { z } from "zod";

export const locationSchema = z.object({
  _id: z.string(),
  name: z.string(),
  link: z.string(),
});
