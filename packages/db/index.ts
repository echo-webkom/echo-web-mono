import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schemas";

const globalForPool = globalThis as unknown as {
  pool: ReturnType<typeof postgres> | undefined;
};

let pool;

if (process.env.NODE_ENV !== "production") {
  if (!globalForPool.pool) {
    globalForPool.pool = createPool();
  }
  pool = globalForPool.pool;
} else {
  pool = createPool();
}

function createPool() {
  return postgres(process.env.DATABASE_URL!, {
    max: 40,
    connect_timeout: 1000,
  });
}

export const db = drizzle(pool, {
  schema,
  logger: process.env.NODE_ENV !== "production",
});
