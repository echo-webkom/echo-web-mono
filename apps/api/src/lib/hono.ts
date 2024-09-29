import { Context, Hono } from "hono";
import postgres from "postgres";

import { createDatabase, Database } from "@echo-webkom/db/create";

export type Bindings = {
  HYPERDRIVE: Hyperdrive;
  ADMIN_KEY: string;
};

export type Variables = {
  db: Database;
};

export type AppContext = Context<{
  Bindings: Bindings;
  Variables: Variables;
}>;

export const createApp = () => {
  const app = new Hono<{
    Bindings: Bindings;
    Variables: Variables;
  }>();

  app.use(async (c, next) => {
    const pool = postgres(c.env.HYPERDRIVE.connectionString, {
      prepare: false,
    });
    const db = createDatabase(pool);

    c.set("db", db);

    await next();
  });

  return app;
};
