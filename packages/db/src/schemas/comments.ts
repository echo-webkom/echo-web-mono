import { relations, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

import { commentsReactions, users } from ".";

export const comments = pgTable(
  "comment",
  {
    id: text("id").notNull().primaryKey().$defaultFn(nanoid),
    postId: text("post_id").notNull(),
    parentCommentId: text("parent_comment_id"),
    userId: text("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .$onUpdateFn(() => new Date()),
  },
  (t) => ({
    postIdx: index("post_idx").on(t.postId),
  }),
);

export const commentsInsert = relations(comments, ({ one, many }) => ({
  parentComment: one(comments, {
    fields: [comments.parentCommentId],
    references: [comments.id],
    relationName: "replies",
  }),
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  replies: many(comments, {
    relationName: "replies",
  }),
  reactions: many(commentsReactions),
}));

export type Comment = InferSelectModel<typeof comments>;
export type CommentInsert = InferInsertModel<typeof comments>;
