import { type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const whitelist = sqliteTable(
  "whitelist",
  {
    email: text("email").notNull(),
    expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
    reason: text("reason").notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.email] }),
  }),
);

export type Whitelist = InferSelectModel<typeof whitelist>;
export type WhitelistInsert = InferInsertModel<typeof whitelist>;

export const selectWhitelistSchema = createSelectSchema(whitelist);
export const insertWhitelistSchema = createInsertSchema(whitelist);
