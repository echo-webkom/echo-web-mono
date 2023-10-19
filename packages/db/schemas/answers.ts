import { pgTable, primaryKey, text, varchar } from "drizzle-orm/pg-core";

import { questions, registrations } from ".";

export const answers = pgTable(
  "answer",
  {
    questionId: varchar("question_id", { length: 21 })
      .notNull()
      .references(() => questions.id),
    registrationId: varchar("registration_id", { length: 21 })
      .notNull()
      .references(() => registrations.id),
    answer: text("answer"),
  },
  (table) => ({
    pk: primaryKey(table.questionId),
  }),
);

export type Answer = (typeof answers)["$inferSelect"];
export type AnswerInsert = (typeof answers)["$inferInsert"];
