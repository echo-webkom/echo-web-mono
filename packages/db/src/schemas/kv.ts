import { type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { blob, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const kv = sqliteTable("kv", {
  key: text("key").notNull().primaryKey(),
  value: blob("value", { mode: "json" }),
  // ttl: timestamp("ttl").default(sql`now() + interval '1 day'`),
  ttl: integer("ttl", { mode: "timestamp" }).$defaultFn(
    () => new Date(new Date().getTime() + 60 * 60 * 24 * 1000),
  ),
});

export type KV = InferSelectModel<typeof kv>;
export type KVInsert = InferInsertModel<typeof kv>;
