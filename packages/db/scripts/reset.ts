import { reset } from "drizzle-seed";

import * as schema from "../src/schemas";
import { db } from "../src/serverless";

async function main() {
  await reset(db, schema);
}

main()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log("✅ Database reset completed.");
    process.exit(0);
  })
  .catch((error) => {
    console.log("❌ Error resetting database:", error);
    console.log("Most likely nothing to reset. Continuing...");
    process.exit(0);
  });
