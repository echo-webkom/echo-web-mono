import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schemas/index.ts";

export type Database = ReturnType<typeof createDatabase>;

// deno-lint-ignore ban-types
export const createPool = (options?: postgres.Options<{}> | undefined) => {
  return postgres(Deno.env.get("DATABASE_URL")!, {
    prepare: false,
    ...options,
  });
};

export const createDatabase = (pool: ReturnType<typeof postgres>) => {
  return drizzle(pool, {
    schema,
    logger: Deno.env.get("DATABASE_LOG") === "true",
  });
};
