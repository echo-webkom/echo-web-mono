import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";
import { loadEnv } from "./env.ts";

await loadEnv();

export const pg = new Client(
  Deno.env.get("DATABASE_URL"),
);

export const runQuery = async (query: string) => {
  await pg.connect();
  const result = await pg.queryArray(query);
  await pg.end();
  return result;
};
