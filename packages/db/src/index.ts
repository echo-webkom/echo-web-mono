import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schemas";

export type Database = ReturnType<typeof createDatabase>;

const globalForPool = globalThis as unknown as {
  pool: ReturnType<typeof postgres> | undefined;
};

let pool;

const createPool = () => {
  return postgres(process.env.DATABASE_URL!, {
    max: 100,
    prepare: false,
    idle_timeout: 10000, // 10 seconds
    connect_timeout: 1000, // 10 seconds
  });
};

if (process.env.NODE_ENV !== "production") {
  if (!globalForPool.pool) {
    globalForPool.pool = createPool();
  }
  pool = globalForPool.pool;
} else {
  pool = createPool();
}

const createDatabase = (pool: ReturnType<typeof postgres>) => {
  return drizzle(pool, {
    schema,
    logger: process.env.DATABASE_LOG === "true",
  });
};

export const db = createDatabase(pool);

/**
 * PostgresError is hærk to work with. Just check if it has a code property.
 * We can deduct enough information from that.
 *
 * @see https://www.postgresql.org/docs/current/errcodes-appendix.html
 */
type PostgresIshError = {
  code: string;
};

export const isPostgresIshError = (e: unknown): e is PostgresIshError => {
  if (typeof e !== "object" || e === null) {
    return false;
  }

  return "code" in e && e instanceof Error;
};
