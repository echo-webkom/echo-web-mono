import { relations, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { blob, integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { answers, happenings, questionTypeEnum } from ".";

type Option = {
  id: string;
  value: string;
};

export const questions = sqliteTable(
  "question",
  {
    id: text("id").notNull(),
    title: text("title").notNull(),
    required: integer("required", { mode: "boolean" }).notNull().default(false),
    type: text("type", { enum: questionTypeEnum }).notNull().default("text"),
    isSensitive: integer("is_sensitive", { mode: "boolean" }).notNull().default(false),
    options: blob("options", { mode: "json" }).$type<Array<Option>>(),
    happeningId: text("happening_id")
      .notNull()
      .references(() => happenings.id, {
        onDelete: "cascade",
      }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
  }),
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
