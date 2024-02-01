import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "./schemas";

const globalForPool = globalThis as unknown as {
  pool: Pool | undefined;
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
  return new Pool({
    max: 40,
    connectionString: process.env.DATABASE_URL,
    ssl: false,
  });
}

export const db = drizzle(pool, {
  schema,
  logger: process.env.NODE_ENV !== "production",
});
