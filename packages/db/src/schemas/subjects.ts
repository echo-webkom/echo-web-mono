import { relations } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { subjectReviews } from "./subject-reviews";

export const subjects = pgTable("subject", {
  subjectCode: text("subject_code").primaryKey(),
  subjectName: text("subject_name").notNull(),
});

export const subjectsRelations = relations(subjects, ({ many }) => ({
  reviews: many(subjectReviews),
}));

export type Subject = (typeof subjects)["$inferSelect"];
export type SubjectInsert = (typeof subjects)["$inferInsert"];

export const selectSubjectSchema = createSelectSchema(subjects);
export const insertSubjectSchema = createInsertSchema(subjects);
