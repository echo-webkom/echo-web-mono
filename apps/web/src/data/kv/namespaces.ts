import z from "zod";

import { KVNamespace } from ".";

export const signInAttempt = new KVNamespace("sign-in-attempt", {
  schema: z.object({
    email: z.string(),
    error: z.string(),
  }),
});
