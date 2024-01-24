import { relations } from "drizzle-orm";
import { pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { users } from ".";

export const sessions = pgTable(
  "session",
  {
    sessionToken: text("session_token").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.sessionToken] }),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export type Session = (typeof sessions)["$inferSelect"];
export type SessionInsert = (typeof sessions)["$inferInsert"];

export const selectSessionSchema = createSelectSchema(sessions);
export const insertSessionSchema = createInsertSchema(sessions);
