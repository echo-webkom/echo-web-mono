import type postgres from "postgres";

import { createDatabase, createPool } from "./create";

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

export const db = createDatabase(pool);
