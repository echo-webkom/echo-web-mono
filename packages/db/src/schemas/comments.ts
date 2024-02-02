import { relations, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";

import { users } from ".";
import { now } from "../utils";

export const comments = sqliteTable(
  "comment",
  {
    id: text("id").notNull().primaryKey().$defaultFn(nanoid),
    postId: text("post_id").notNull(),
    parentCommentId: text("parent_comment_id"),
    userId: text("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    content: text("content").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(now),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$onUpdateFn(now),
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
}));

export type Comment = InferSelectModel<typeof comments>;
export type CommentInsert = InferInsertModel<typeof comments>;
