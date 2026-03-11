import { type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";

import { commentReactionType } from "./enums";

export const commentsReactions = pgTable(
  "comments_reactions",
  {
    commentId: text("comment_id").notNull(),
    userId: text("user_id").notNull(),
    type: commentReactionType("type").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.commentId, t.userId] })],
).enableRLS();

export type CommentReaction = InferSelectModel<typeof commentsReactions>;
export type CommentReactionInsert = InferInsertModel<typeof commentsReactions>;
