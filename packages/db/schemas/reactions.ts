/* import { relations } from "drizzle-orm"; */
import { integer, pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";

import { users } from "./users";

export const reactions = pgTable(
  "reaction",
  {
    reactionId: text("id").notNull(),
    emojiId: integer("reaction_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.reactionId] }),
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
