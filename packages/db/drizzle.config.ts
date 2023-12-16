import { defineConfig } from "drizzle-kit";

export default defineConfig({
  driver: "pg",
  out: "./drizzle/migrations",
  strict: true,
  schema: "./schemas",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
});
