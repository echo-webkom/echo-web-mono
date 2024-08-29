import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

import * as schema from "./schemas";

const { Pool } = pg;

export type Database = ReturnType<typeof createDatabase>;

const globalForPool = globalThis as unknown as {
  pool: pg.Pool | undefined;
};

let pool;

const createPool = () => {
  return new Pool({
    connectionString: process.env.DATABASE_URL!,
    ssl: false,
    max: 15,
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

const createDatabase = (pool: pg.Pool) => {
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
