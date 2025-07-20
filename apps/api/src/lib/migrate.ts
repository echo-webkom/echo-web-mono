import { migrate } from "drizzle-orm/pglite/migrator";

import { db } from "./db";

type PgLiteDatabase = Parameters<typeof migrate>[0];

export async function applyMigrations() {
  await migrate(db as unknown as PgLiteDatabase, {
    migrationsFolder: `${process.cwd()}/../../packages/db/drizzle/migrations`,
  });
}
