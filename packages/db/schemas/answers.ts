import { relations } from "drizzle-orm";
import { foreignKey, pgTable, primaryKey, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { happenings, questions, registrations, users } from ".";

export const answers = pgTable(
  "answer",
  {
    questionId: varchar("question_id", { length: 21 }).notNull(),
    userId: text("user_id").notNull(),
    happeningSlug: text("happening_slug").notNull(),
    answer: text("answer"),
  },
  (table) => ({
    pk: primaryKey(table.questionId),
    fk: foreignKey({
      columns: [table.happeningSlug, table.userId],
      foreignColumns: [registrations.happeningSlug, registrations.userId],
    }),
  }),
);

export const answersRelations = relations(answers, ({ one }) => ({
  question: one(questions, {
    fields: [answers.questionId],
    references: [questions.id],
  }),
  registration: one(registrations, {
    fields: [answers.happeningSlug, answers.userId],
    references: [registrations.happeningSlug, registrations.userId],
  }),
  happening: one(happenings, {
    fields: [answers.happeningSlug],
    references: [happenings.slug],
  }),
  user: one(users, {
    fields: [answers.userId],
    references: [users.id],
  }),
}));

export type Answer = (typeof answers)["$inferSelect"];
export type AnswerInsert = (typeof answers)["$inferInsert"];

export const selectAnswerSchema = createSelectSchema(answers);
export const insertAnswerSchema = createInsertSchema(answers);
