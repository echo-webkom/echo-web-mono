import { db } from "@echo-webkom/db";
import z from "zod";

import { KVDrizzleAdapter } from "./kv-adapter";
import { KVNamespace } from "./kv-namespace";

const adapter = new KVDrizzleAdapter(db);

export const signInAttempt = new KVNamespace(adapter, "sign-in-attempt", {
  schema: z.object({
    email: z.string(),
    error: z.string(),
  }),
});
