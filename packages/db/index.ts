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
    max: 90,
    prepare: false,
  });
}

export const db = drizzle(pool, {
  schema,
  logger: process.env.DATABASE_LOG === "true",
});

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
