import "server-only";

import { drizzle } from "drizzle-orm/node-postgres";

import { pool } from "./pool";
import * as schema from "./schemas";

export const db = drizzle(pool, {
  schema,
});
