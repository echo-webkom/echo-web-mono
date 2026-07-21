import { reset } from "drizzle-seed";

import { db } from "../src";
import * as schema from "../src/schemas";

async function main() {
  await reset(db, schema);
}

main()
  .then(() => {
    // oxlint-disable-next-line no-console
    console.log("✅ Database reset completed.");
    process.exit(0);
  })
  .catch((error) => {
    // oxlint-disable-next-line no-console
    console.log("❌ Error resetting database:", error);
    // oxlint-disable-next-line no-console
    console.log("Most likely nothing to reset. Continuing...");
    process.exit(0);
  });
