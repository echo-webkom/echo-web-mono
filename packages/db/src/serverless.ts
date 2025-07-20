import type postgres from "postgres";

import { createDatabase, createPool } from "./create";

const MAX_POOL = 1;
const IDLE_TIMEOUT = 10000; // 10 seconds
const CONNECT_TIMEOUT = 1000; // 1 seconds

const globalForPool = globalThis as unknown as {
  pool: ReturnType<typeof postgres> | undefined;
};

let pool;

if (process.env.NODE_ENV !== "production") {
  globalForPool.pool ??= createPool({
    max: MAX_POOL,
    idle_timeout: IDLE_TIMEOUT,
    connect_timeout: CONNECT_TIMEOUT,
  });
  pool = globalForPool.pool;
} else {
  pool = createPool({
    max: MAX_POOL,
    idle_timeout: IDLE_TIMEOUT,
    connect_timeout: CONNECT_TIMEOUT,
  });
}

export const db = createDatabase(pool);
