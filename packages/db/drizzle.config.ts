import { type Config } from "drizzle-kit";

export default {
  driver: "pg",
  out: "./drizzle/migrations",
  strict: true,
  schema: "./schemas",
  verbose: true,
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;
