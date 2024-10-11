import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  out: "./drizzle/migrations",
  schema: "./src/schemas",
  dbCredentials: {
    url: Deno.env.get("DATABASE_URL")!,
  },
});
