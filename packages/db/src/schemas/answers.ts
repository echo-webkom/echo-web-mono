import { type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { json, pgTable, primaryKey, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { happenings } from "./happenings";
import { questions } from "./questions";
import { users } from "./users";

type AnswerCol = {
  answer: string | Array<string>;
};

export const answers = pgTable(
  "answer",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    happeningId: varchar("happening_id", { length: 255 })
      .notNull()
      .references(() => happenings.id, {
        onDelete: "cascade",
      }),
    questionId: varchar("question_id", { length: 255 })
      .notNull()
      .references(() => questions.id, {
        onDelete: "cascade",
      }),
    answer: json("answer").$type<AnswerCol>(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.happeningId, t.questionId] })],
).enableRLS();

export type Answer = InferSelectModel<typeof answers>;
export type AnswerInsert = InferInsertModel<typeof answers>;

export const selectAnswerSchema = createSelectSchema(answers);
export const insertAnswerSchema = createInsertSchema(answers);
