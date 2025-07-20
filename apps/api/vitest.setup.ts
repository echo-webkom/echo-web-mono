import { PGlite } from "@electric-sql/pglite";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/pglite";
import { afterAll, afterEach, beforeEach, vi } from "vitest";

import * as schema from "@echo-webkom/db/schemas";

import { client, db } from "@/lib/db";
import { applyMigrations } from "@/lib/migrate";

vi.mock("@/lib/db", () => {
  const client = new PGlite();
  const db = drizzle(client, { schema });

  return {
    client,
    db,
  };
});

beforeEach(async () => {
  await applyMigrations();
});

afterEach(async () => {
  await db.execute(sql`drop schema if exists public cascade`);
  await db.execute(sql`create schema public`);
  await db.execute(sql`drop schema if exists drizzle cascade`);
});

afterAll(async () => {
  await (client as unknown as PGlite).close();
});
