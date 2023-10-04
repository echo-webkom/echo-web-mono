import { z } from "zod";

export const userFormSchema = z.object({
  groups: z.string().array(),
});
