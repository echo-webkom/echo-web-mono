import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    ADMIN_KEY: z.string().optional().default(""),
    UPSTASH_REDIS_REST_URL: z.string().default(""),
    UPSTASH_REDIS_REST_TOKEN: z.string().default(""),
  },
  client: {
    NEXT_PUBLIC_SANITY_DATASET: z.enum(["production", "develop", "testing"]).default("develop"),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    ADMIN_KEY: process.env.ADMIN_KEY,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
  },
});
