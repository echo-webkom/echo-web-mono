import { z } from "zod";

export const addUserToGroupSchema = z.object({
  email: z.string().email().endsWith("@student.uib.no"),
});
