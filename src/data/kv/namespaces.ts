import z from "zod";

import { db } from "@/db/drizzle";
import { KVDrizzleAdapter } from "./kv-adapter";
import { KVNamespace } from "./kv-namespace";

const adapter = new KVDrizzleAdapter(db);

export const signInAttempt = new KVNamespace(adapter, "sign-in-attempt", {
  schema: z.object({
    email: z.string(),
    error: z.string(),
  }),
});
