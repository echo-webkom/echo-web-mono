import { relations, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";

import { comments, users } from ".";
import { commentReactionType } from "./enums";

export const commentsReactions = pgTable(
  "comments_reactions",
  {
    commentId: text().notNull(),
    userId: text().notNull(),
    type: commentReactionType().notNull(),
    createdAt: timestamp().notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.commentId, table.userId] })],
);

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
