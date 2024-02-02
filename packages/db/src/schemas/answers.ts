import { relations, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { blob, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { happenings, questions, registrations, users } from ".";

type AnswerCol = {
  answer: string | Array<string>;
};

export const answers = sqliteTable(
  "answer",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    happeningId: text("happening_id")
      .notNull()
      .references(() => happenings.id, {
        onDelete: "cascade",
      }),
    questionId: text("question_id")
      .notNull()
      .references(() => questions.id, {
        onDelete: "cascade",
      }),
    answer: blob("answer", { mode: "json" }).$type<AnswerCol>(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.happeningId, table.questionId] }),
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

export type Answer = InferSelectModel<typeof answers>;
export type AnswerInsert = InferInsertModel<typeof answers>;

export const selectAnswerSchema = createSelectSchema(answers);
export const insertAnswerSchema = createInsertSchema(answers);
