import { relations } from "drizzle-orm";
import { pgTable, uuid, varchar, primaryKey } from "drizzle-orm/pg-core";
import { questions } from "./questions";
import { registrations } from "./registrations";

export const answers = pgTable(
  "answer",
  {
    id: uuid("id").notNull().defaultRandom(),
    registrationId: uuid("registration_id"),
    questionId: uuid("question_id"),
    answer: varchar("answer", { length: 255 }),
  },
  (a) => ({
    primaryKey: primaryKey(a.id),
  })
);

export const answersRelations = relations(answers, ({ one }) => ({
  registration: one(registrations, {
    fields: [answers.registrationId],
    references: [registrations.id],
  }),
  question: one(questions, {
    fields: [answers.questionId],
    references: [questions.id],
  }),
}));
