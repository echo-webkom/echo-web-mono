import { relations } from "drizzle-orm";
import { foreignKey, pgTable, primaryKey, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { happenings, questions, registrations, users } from ".";

export const answers = pgTable(
  "answer",
  {
    questionId: varchar("question_id", { length: 21 }).notNull(),
    userId: text("user_id").notNull(),
    happeningId: text("happening_id")
      .notNull()
      .references(() => happenings.id, {
        onDelete: "cascade",
      }),
    answer: text("answer"),
  },
  (table) => ({
    pk: primaryKey(table.questionId),
    fk: foreignKey({
      columns: [table.happeningId, table.userId],
      foreignColumns: [registrations.happeningId, registrations.userId],
    }),
  }),
);

export const answersRelations = relations(answers, ({ one }) => ({
  question: one(questions, {
    fields: [answers.questionId],
    references: [questions.id],
  }),
  registration: one(registrations, {
    fields: [answers.happeningId, answers.userId],
    references: [registrations.happeningId, registrations.userId],
  }),
  happening: one(happenings, {
    fields: [answers.happeningId],
    references: [happenings.id],
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
