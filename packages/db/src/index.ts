import { createClient, type Client } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import * as schema from "./schemas";

const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

const createDatabase = (client: Client) => {
  return drizzle(client, {
    schema,
    logger: process.env.NODE_ENV !== "production",
  });
};

export type Database = ReturnType<typeof createDatabase>;

export const db = createDatabase(client);
