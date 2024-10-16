import { migrate } from "drizzle-orm/pglite/migrator";

import { db } from "./db";

export async function applyMigrations() {
  // @ts-ignore idc
  await migrate(db, { migrationsFolder: `${process.cwd()}/../../packages/db/drizzle/migrations` });
}
