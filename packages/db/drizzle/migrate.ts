/* eslint-disable no-console */
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const pg = postgres(process.env.DATABASE_URL!, {
  max: 1,
});

const db = drizzle(pg);

console.log("🚚 Starting migration...");

void migrate(db, {
  migrationsFolder: "./drizzle/migrations",
})
  .then(() => {
    console.log("✅ Migrated successfully");
    process.exit(0);
  })
  .catch((e) => {
    console.error("🚨 Migrations failed with error:", e);
    process.exit(1);
  })
  .finally(() => {
    void pg.end();
  });
