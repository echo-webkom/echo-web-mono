import { relations } from "drizzle-orm";
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

export type Question = (typeof questions)["$inferSelect"];
export type QuestionInsert = (typeof questions)["$inferInsert"];

export const selectQuestionSchema = createSelectSchema(questions);
export const insertQuestionSchema = createInsertSchema(questions);
