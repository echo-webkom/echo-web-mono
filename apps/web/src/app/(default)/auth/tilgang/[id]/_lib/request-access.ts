import { z } from "zod";

export const requestAccessSchema = z.object({
  email: z.string().email(),
  reason: z.string().min(5),
});

export type IRequestAccessForm = z.infer<typeof requestAccessSchema>;
