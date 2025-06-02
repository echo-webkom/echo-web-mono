import { relations, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { index, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

import { users } from ".";

export const dots = pgTable(
  "dot",
  {
    id: serial("id").notNull().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    count: integer("count").notNull(),
    reason: text("reason").notNull(),
    strikedBy: text("striked_by").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").notNull(),
  },
  (dot) => [index("user_strike_idx").on(dot.userId, dot.id)],
);

export const dotsRelations = relations(dots, ({ one }) => ({
  user: one(users, {
    fields: [dots.userId],
    references: [users.id],
    relationName: "dots",
  }),
  strikedByUser: one(users, {
    fields: [dots.strikedBy],
    references: [users.id],
  }),
}));

export type Dot = InferSelectModel<typeof dots>;
export type DotInsert = InferInsertModel<typeof dots>;
