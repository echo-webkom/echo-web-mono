import { relations, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { index, json, pgTable, primaryKey, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { happeningsToGroups, happeningTypeEnum, questions, registrations, spotRanges } from ".";

export const happenings = pgTable(
  "happening",
  {
    id: varchar({ length: 255 }).notNull(),
    slug: varchar({ length: 255 }).notNull().unique(),
    title: varchar({ length: 255 }).notNull(),
    type: happeningTypeEnum().notNull().default("event"),
    date: timestamp(),
    registrationGroups: json().$type<Array<string>>(),
    registrationStartGroups: timestamp(),
    registrationStart: timestamp(),
    registrationEnd: timestamp(),
  },
  (table) => [primaryKey({ columns: [table.id] }), index("slug_idx").on(table.slug)],
);

export const happeningsRelations = relations(happenings, ({ many }) => ({
  registrations: many(registrations),
  spotRanges: many(spotRanges),
  questions: many(questions),
  groups: many(happeningsToGroups),
}));

export type Happening = InferSelectModel<typeof happenings>;
export type HappeningInsert = InferInsertModel<typeof happenings>;

export const selectHappeningSchema = createSelectSchema(happenings);
export const insertHappeningSchema = createInsertSchema(happenings);
