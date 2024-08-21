import { relations } from "drizzle-orm";
import { integer, pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { subjects } from "./subjects";
import { users } from "./users";

export const subjectReviews = pgTable(
  "subject_review",
  {
    userId: text("id")
      .notNull()
      .references(() => users.id),
    subjectCode: text("subject_review")
      .notNull()
      .references(() => subjects.subjectCode),
    difficulty: integer("difficulty").notNull(),
    usefullness: integer("usefullness").notNull(),
    enjoyment: integer("enjoyment").notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.subjectCode] }),
  }),
);

export const subjectReviewsRelations = relations(subjectReviews, ({ one }) => ({
  user: one(users, {
    fields: [subjectReviews.userId],
    references: [users.id],
  }),
  subjectCode: one(subjects, {
    fields: [subjectReviews.subjectCode],
    references: [subjects.subjectCode],
  }),
}));

export type subjectReview = (typeof subjectReviews)["$inferSelect"];
export type SubjectReviewtInsert = (typeof subjectReviews)["$inferInsert"];

export const selectSubjectReviewSchema = createSelectSchema(subjectReviews);
export const insertSubjectReviewSchema = createInsertSchema(subjectReviews);
