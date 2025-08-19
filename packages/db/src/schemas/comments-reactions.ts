import { relations, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";

import { comments, users } from ".";
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

export const commentsActionsRelations = relations(commentsReactions, ({ one }) => ({
  user: one(users, {
    fields: [commentsReactions.userId],
    references: [users.id],
  }),
  comment: one(comments, {
    fields: [commentsReactions.commentId],
    references: [comments.id],
  }),
}));

export type CommentReaction = InferSelectModel<typeof commentsReactions>;
export type CommentReactionInsert = InferInsertModel<typeof commentsReactions>;
