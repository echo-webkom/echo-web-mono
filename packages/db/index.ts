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
    connectionString: process.env.DATABASE_URL!,
  });
}

export const db = drizzle(pool, {
  schema,
});
