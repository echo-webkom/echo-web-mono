import { type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { now } from "../utils";

export const accessRequests = sqliteTable("access_request", {
  id: text("id").notNull().primaryKey(),
  email: text("email").unique().notNull(),
  reason: text("reason").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(now),
});

export type AccessRequest = InferSelectModel<typeof accessRequests>;
export type AccessRequestInsert = InferInsertModel<typeof accessRequests>;
