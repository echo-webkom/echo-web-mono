import { z } from "zod";

export const userFormSchema = z.object({
  memberships: z.string().array(),
});
