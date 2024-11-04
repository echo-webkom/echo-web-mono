import { relations, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { boolean, json, pgTable, primaryKey, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { answers, happenings, questionTypeEnum } from ".";

type Option = {
  id: string;
  value: string;
};

export const questions = pgTable(
  "question",
  {
    id: varchar({ length: 255 }).notNull(),
    title: text().notNull(),
    required: boolean().notNull().default(false),
    type: questionTypeEnum().notNull().default("text"),
    isSensitive: boolean().notNull().default(false),
    options: json().$type<Array<Option>>(),
    happeningId: varchar({ length: 255 })
      .notNull()
      .references(() => happenings.id, {
        onDelete: "cascade",
      }),
  },
  (table) => [primaryKey({ columns: [table.id] })],
);

export const questionsRelations = relations(questions, ({ one, many }) => ({
  happening: one(happenings, {
    fields: [questions.happeningId],
    references: [happenings.id],
  }),
  answers: many(answers),
}));

export type Question = InferSelectModel<typeof questions>;
export type QuestionInsert = InferInsertModel<typeof questions>;

export const selectQuestionSchema = createSelectSchema(questions);
export const insertQuestionSchema = createInsertSchema(questions);
