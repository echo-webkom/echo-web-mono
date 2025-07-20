import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schemas";

export type Database = ReturnType<typeof createDatabase>;

type Options = Parameters<typeof postgres>[1];

export const createPool = (options?: Options) => {
  return postgres(process.env.DATABASE_URL!, {
    prepare: false,
    ...options,
  });
};

export const createDatabase = (pool: ReturnType<typeof postgres>) => {
  return drizzle(pool, {
    schema,
    logger: process.env.DATABASE_LOG === "true",
  });
};
