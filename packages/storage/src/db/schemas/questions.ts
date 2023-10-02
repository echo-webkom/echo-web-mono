import { relations } from "drizzle-orm";
import { boolean, json, pgTable, primaryKey, uuid, varchar } from "drizzle-orm/pg-core";
import { z } from "zod";

import { questionTypeEnum } from "./enums";
import { happenings } from "./happenings";

export const optionsSchema = z.object({
  label: z.string(),
  value: z.string(),
});

export type Option = z.infer<typeof optionsSchema>;

export const questions = pgTable(
  "question",
  {
    id: uuid("id").notNull().defaultRandom(),
    happeningSlug: varchar("happening_slug", { length: 255 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    type: questionTypeEnum("type"),
    required: boolean("required").notNull().default(false),
    options: json("options").$type<Array<Option>>(),
  },
  (q) => ({
    primaryKey: primaryKey(q.id),
  }),
);

export const questionsRelations = relations(questions, ({ one }) => ({
  happening: one(happenings, {
    fields: [questions.happeningSlug],
    references: [happenings.slug],
  }),
}));
