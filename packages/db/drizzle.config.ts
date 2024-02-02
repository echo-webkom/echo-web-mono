import { defineConfig } from "drizzle-kit";

const url = process.env.DATABASE_URL!;
const isFile = url.startsWith("file");

const config = isFile
  ? {
      dbCredentials: {
        url,
      },
    }
  : {
      driver: "turso",
      dbCredentials: {
        url,
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        authToken: process.env.DATABASE_AUTH_TOKEN || undefined,
      },
    };

export default defineConfig({
  out: "./drizzle/migrations",
  schema: "./src/schemas/index.ts",
  dialect: "sqlite",
  ...config,
});
