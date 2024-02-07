import { createPool, db as vercelDb, type VercelPool } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";

import * as schema from "./schemas";

declare global {
  // eslint-disable-next-line no-var
  var __pool: VercelPool | undefined;
}

function _createPool() {
  let pool;

  if (process.env.VERCEL === "1") {
    pool = vercelDb;
  } else {
    pool = createPool({
      connectionString: process.env.DATABASE_URL,
    });
  }

  return pool;
}

function getCachedPool() {
  if (!global.__pool) {
    global.__pool = _createPool();
  }

  return global.__pool;
}

const pool = getCachedPool();

export const db = drizzle(pool, {
  schema,
  logger: process.env.NODE_ENV !== "production",
});
