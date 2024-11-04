import { relations, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

import { commentsReactions, users } from ".";

export const comments = pgTable(
  "comment",
  {
    id: text().notNull().primaryKey().$defaultFn(nanoid),
    postId: text().notNull(),
    parentCommentId: text(),
    userId: text().references(() => users.id, {
      onDelete: "set null",
    }),
    content: text().notNull(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp()
      .notNull()
      .$onUpdateFn(() => new Date()),
  },
  (t) => [index("post_idx").on(t.postId)],
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
