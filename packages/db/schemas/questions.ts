import { relations } from "drizzle-orm";
import { boolean, json, pgTable, primaryKey, text, varchar } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

import { happenings, questionTypeEnum } from ".";

type Option = {
  id: string;
  value: string;
};

export const questions = pgTable(
  "question",
  {
    id: varchar("id", { length: 21 })
      .notNull()
      .$defaultFn(() => nanoid()),
    title: text("title").notNull(),
    required: boolean("required").notNull().default(false),
    type: questionTypeEnum("type").notNull().default("text"),
    options: json("options").$type<Array<Option>>(),
    happeningSlug: text("happening_slug")
      .notNull()
      .references(() => happenings.slug),
  },
  (q) => ({
    pk: primaryKey(q.id),
  }),
);

export const questionsRelations = relations(questions, ({ one }) => ({
  happening: one(happenings, {
    fields: [questions.happeningSlug],
    references: [happenings.slug],
  }),
}));

export type Question = (typeof questions)["$inferSelect"];
export type QuestionInsert = (typeof questions)["$inferInsert"];
