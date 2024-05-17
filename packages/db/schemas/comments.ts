import { relations } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

import { users } from ".";

export const comments = pgTable("comment", {
  id: text("id").notNull().primaryKey().$defaultFn(nanoid),
  postId: text("post_id").notNull(),
  parentCommentId: text("parent_comment_id"),
  userId: text("user_id").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdateFn(() => new Date()),
});

export const commentsInsert = relations(comments, ({ one, many }) => ({
  parentComment: one(comments, {
    fields: [comments.parentCommentId],
    references: [comments.id],
    relationName: "parentComment",
  }),
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  replies: many(comments),
}));

export type Comment = (typeof comments)["$inferSelect"];
export type CommentInsert = (typeof comments)["$inferInsert"];
