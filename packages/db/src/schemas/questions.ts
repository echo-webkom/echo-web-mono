import { relations, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { boolean, json, pgTable, primaryKey, text, varchar } from "drizzle-orm/pg-core";

import { answers, happenings, questionTypeEnum } from ".";

type Option = {
  id: string;
  value: string;
};

export const questions = pgTable(
  "question",
  {
    id: varchar("id", { length: 255 }).notNull(),
    title: text("title").notNull(),
    required: boolean("required").notNull().default(false),
    type: questionTypeEnum("type").notNull().default("text"),
    isSensitive: boolean("is_sensitive").notNull().default(false),
    options: json("options").$type<Array<Option>>(),
    happeningId: varchar("happening_id", { length: 255 })
      .notNull()
      .references(() => happenings.id, {
        onDelete: "cascade",
      }),
  },
  (question) => [primaryKey({ columns: [question.id] })],
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
