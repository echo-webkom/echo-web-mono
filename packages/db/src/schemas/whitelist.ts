import { type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";

export const whitelist = pgTable(
  "whitelist",
  {
    email: text("email").notNull(),
    expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
    reason: text("reason").notNull(),
  },
  (whitelist) => [primaryKey({ columns: [whitelist.email] })],
);

export type Whitelist = InferSelectModel<typeof whitelist>;
export type WhitelistInsert = InferInsertModel<typeof whitelist>;
