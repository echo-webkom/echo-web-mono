import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schemas";

const globalForPg = globalThis as unknown as {
  pg: ReturnType<typeof postgres> | undefined;
};

let pg;

if (process.env.NODE_ENV !== "production") {
  if (!globalForPg.pg) {
    globalForPg.pg = postgres(process.env.DATABASE_URL!);
  }
  pg = globalForPg.pg;
} else {
  pg = postgres(process.env.DATABASE_URL!);
}

export const db = drizzle(pg, {
  schema,
});
