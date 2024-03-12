import { integer, pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { subjects } from "./subjects";

export const subjectReviews = pgTable(
  "subject_review",
  {
    id: text("id").notNull(),
    subjectCode: text("subject_")
      .notNull()
      .references(() => subjects.subjectCode),
    difficulty: integer("difficulty").notNull(),
    usefullness: integer("usefullness").notNull(),
    enjoyment: integer("enjoyment").notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
  }),
);

export type subjectReview = (typeof subjectReviews)["$inferSelect"];
export type SubjecReviewtInsert = (typeof subjectReviews)["$inferInsert"];

export const selectSubjectReviewSchema = createSelectSchema(subjectReviews);
export const insertSubjectReviewSchema = createInsertSchema(subjectReviews);
