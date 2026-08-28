import { db } from "@echo-webkom/db/serverless";
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

export const featureFlags = new KVNamespace(adapter, "feature-flags", {
  schema: z.object({
    showHSApplications: z.boolean(),
  }),
});
