import { createClient } from "redis";

export const kv = createClient({
  url: process.env.REDIS_URL,
});
kv.connect();

export type KV = typeof kv;
