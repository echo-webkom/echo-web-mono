import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  out: "./drizzle/migrations",
  schema: "./schemas",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
