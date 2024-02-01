/* eslint-disable no-console */
import process from "node:process";
import { migrate } from "drizzle-orm/node-postgres/migrator";

import { db } from "..";

// TODO: Uncomment this when pushing to main
// if (process.env.VERCEL_ENV === "preview") {
//   process.exit(0);
// }

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
  });
