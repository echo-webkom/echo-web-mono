/* import { relations } from "drizzle-orm"; */
import { integer, pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";

import { users } from "./users";

export const reactions = pgTable(
  "reaction",
  {
    happeningId: text("happening_id").notNull(),
    emojiId: integer("emoji_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.happeningId, table.emojiId, table.userId] }),
  }),
);

/* export const reactionsRelations = relations(reactions, ({ one }) => ({
  user: one(users, {
    fields: [reactions.userId],
    references: [users.id],
  }),
})); */

export type Reaction = (typeof reactions)["$inferSelect"];
export type ReactionInsert = (typeof reactions)["$inferInsert"];
