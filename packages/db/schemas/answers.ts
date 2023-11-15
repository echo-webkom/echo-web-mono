import { relations } from "drizzle-orm";
import { index, pgTable, primaryKey, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { happenings, questions, registrations, users } from ".";

export const answers = pgTable(
  "answer",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    happeningId: varchar("happening_id")
      .notNull()
      .references(() => happenings.id, {
        onDelete: "cascade",
      }),
    questionId: varchar("question_id")
      .notNull()
      .references(() => questions.id, {
        onDelete: "cascade",
      }),
    answer: text("answer"),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.happeningId, table.questionId] }),
    questionIdx: index("question_idx").on(table.questionId),
  }),
);

export const answersRelations = relations(answers, ({ one }) => ({
  user: one(registrations, {
    fields: [answers.userId, answers.happeningId],
    references: [registrations.userId, registrations.happeningId],
  }),
  happening: one(happenings, {
    fields: [answers.happeningId],
    references: [happenings.id],
  }),
  question: one(questions, {
    fields: [answers.questionId],
    references: [questions.id],
  }),
}));

export type Answer = (typeof answers)["$inferSelect"];
export type AnswerInsert = (typeof answers)["$inferInsert"];

export const selectAnswerSchema = createSelectSchema(answers);
export const insertAnswerSchema = createInsertSchema(answers);
