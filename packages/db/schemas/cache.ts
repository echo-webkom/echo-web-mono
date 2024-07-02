import { sql, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { json, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const cache = pgTable("cache", {
  key: text("key").primaryKey(),
  value: json("value"),
  ttl: timestamp("ttl")
    .notNull()
    .default(sql`now() + interval '1 day'`),
});

export type Cache = InferSelectModel<typeof cache>;
export type CacheInsert = InferInsertModel<typeof cache>;
