import { z } from "zod";

export const addStrikesSchema = z.object({
  userId: z.string().min(1),
  reason: z.string().min(1),
  count: z.coerce.number().min(1).max(5),
  expiresInMonths: z.coerce.number().min(1).max(12),
});
