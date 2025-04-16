import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@echo-webkom/db/schemas";

const pg = postgres(process.env.DATABASE_URL!);
export const db = drizzle(pg, {
  schema,
});
