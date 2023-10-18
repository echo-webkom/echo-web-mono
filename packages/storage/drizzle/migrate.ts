/* eslint-disable no-console */
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

console.log("🚀 Starting migrations...");

migrate(
  drizzle(
    postgres(process.env.DATABASE_URL!, {
      max: 1,
    }),
  ),
  { migrationsFolder: "./drizzle/migrations" },
)
  .then(() => {
    console.log("✅ Migrations complete!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("🚨 Migrations failed! Error:", err);
    process.exit(1);
  });
