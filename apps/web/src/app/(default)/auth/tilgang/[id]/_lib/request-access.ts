import { z } from "zod";

export const requestAccessSchema = z.object({
  email: z.email(),
  reason: z.string().min(5),
  quiz: z.string().refine((val) => val.startsWith("echo"), { message: "Feil svar" }),
});

export type IRequestAccessForm = z.input<typeof requestAccessSchema>;
