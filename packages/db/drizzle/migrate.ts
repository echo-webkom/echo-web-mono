/* eslint-disable no-console */
import process from "node:process";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";

if (process.env.VERCEL_ENV === "preview") {
  process.exit(0);
}

const pg = new Pool({
  connectionString: process.env.DATABASE_URL!,
  max: 1,
});

const db = drizzle(pg);

console.log("🚚 Starting migration...");

migrate(db, {
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
