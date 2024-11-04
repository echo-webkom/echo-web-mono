import { type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const accessRequests = pgTable("access_request", {
  id: text().primaryKey(),
  email: text().unique().notNull(),
  reason: text().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
});

export type AccessRequest = InferSelectModel<typeof accessRequests>;
export type AccessRequestInsert = InferInsertModel<typeof accessRequests>;
