import { type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const accessRequests = pgTable("access_request", {
  id: text("id").primaryKey(),
  email: text("email").unique().notNull(),
  reason: text("reason").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}).enableRLS();

export type AccessRequest = InferSelectModel<typeof accessRequests>;
export type AccessRequestInsert = InferInsertModel<typeof accessRequests>;
