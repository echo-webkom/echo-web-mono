import { pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const subjects = pgTable(
  "subject",
  {
    subjectCode: text("subject_code").notNull(),
    subjectName: text("subject_name").notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.subjectCode] }),
  }),
);

export type Subject = (typeof subjects)["$inferSelect"];
export type SubjectInsert = (typeof subjects)["$inferInsert"];

export const selectSubjectSchema = createSelectSchema(subjects);
export const insertSubjectSchema = createInsertSchema(subjects);
