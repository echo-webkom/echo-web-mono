import { z } from "zod";

export const addUserToGroupSchema = z.object({
  userId: z.string().min(1, "Please select a user"),
});
