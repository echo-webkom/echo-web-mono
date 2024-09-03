import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schemas";

export type Database = PostgresJsDatabase<typeof schema>;

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

export const db = drizzle(pool, {
  schema,
  logger: process.env.DATABASE_LOG === "true",
});
