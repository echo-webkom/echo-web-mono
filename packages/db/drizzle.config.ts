import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  out: "./drizzle/migrations",
  schema: "./src/schemas",
  casing: "snake_case",

  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
