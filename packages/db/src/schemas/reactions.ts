import { relations, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { now } from "../utils";
import { users } from "./users";

export const reactions = sqliteTable(
  "reaction",
  {
    reactToKey: text("react_to_key").notNull(),
    emojiId: integer("emoji_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "no action" }),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(now),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.reactToKey, table.emojiId, table.userId] }),
  }),
);

export const reactionsRelations = relations(reactions, ({ one }) => ({
  user: one(users, {
    fields: [reactions.userId],
    references: [users.id],
  }),
}));

export type Reaction = InferSelectModel<typeof reactions>;
export type ReactionInsert = InferInsertModel<typeof reactions>;
