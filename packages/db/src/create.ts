import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schemas";

export type Database = ReturnType<typeof createDatabase>;

// eslint-disable-next-line @typescript-eslint/ban-types
export const createPool = (options?: postgres.Options<{}> | undefined) => {
  return postgres(process.env.DATABASE_URL!, {
    prepare: false,
    ...options,
  });
};

export const createDatabase = (pool: ReturnType<typeof postgres>) => {
  return drizzle(pool, {
    schema,
    casing: "snake_case",
    logger: process.env.DATABASE_LOG === "true",
  });
};
