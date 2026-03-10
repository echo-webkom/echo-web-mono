import { type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { integer, pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";

import { users } from "./users";

export const reactions = pgTable(
  "reaction",
  {
    reactToKey: text("react_to_key").notNull(),
    emojiId: integer("emoji_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "no action" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.reactToKey, t.emojiId, t.userId] })],
).enableRLS();

export type Reaction = InferSelectModel<typeof reactions>;
export type ReactionInsert = InferInsertModel<typeof reactions>;
