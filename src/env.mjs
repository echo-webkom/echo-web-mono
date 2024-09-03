import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    ADMIN_KEY: z.string().optional().default(""),
  },
  client: {
    NEXT_PUBLIC_SANITY_DATASET: z.enum(["production", "develop", "testing"]).default("develop"),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    ADMIN_KEY: process.env.ADMIN_KEY,
    NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
  },
});
