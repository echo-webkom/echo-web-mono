import { relations, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { integer, pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";

import { users } from "./users";

export const reactions = pgTable(
  "reaction",
  {
    reactToKey: text().notNull(),
    emojiId: integer().notNull(),
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: "no action" }),
    createdAt: timestamp().notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.reactToKey, table.emojiId, table.userId] })],
);

export const reactionsRelations = relations(reactions, ({ one }) => ({
  user: one(users, {
    fields: [reactions.userId],
    references: [users.id],
  }),
}));

export type Reaction = InferSelectModel<typeof reactions>;
export type ReactionInsert = InferInsertModel<typeof reactions>;
