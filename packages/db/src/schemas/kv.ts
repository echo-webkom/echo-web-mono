import { sql, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { json, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const kv = pgTable("kv", {
  key: text().notNull().primaryKey(),
  value: json(),
  ttl: timestamp().default(sql`now() + interval '1 day'`),
});

export type KV = InferSelectModel<typeof kv>;
export type KVInsert = InferInsertModel<typeof kv>;
