import { sql, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { json, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const kv = pgTable("kv", {
  key: text("key").notNull().primaryKey(),
  value: json("value"),
  ttl: timestamp("ttl").default(sql`now() + interval '1 day'`),
}).enableRLS();

export type KV = InferSelectModel<typeof kv>;
export type KVInsert = InferInsertModel<typeof kv>;
