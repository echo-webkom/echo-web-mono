import { type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const whitelist = pgTable(
  "whitelist",
  {
    email: text("email").notNull(),
    expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
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
