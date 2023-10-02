import "dotenv/config";

import type { Config } from "drizzle-kit";

export default {
  out: "./drizzle/migrations",
  schema: "./src/db/schemas",
  driver: "pg",
  verbose: true,
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;
