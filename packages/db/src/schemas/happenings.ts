import { relations, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { blob, index, integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { happeningsToGroups, happeningTypeEnum, questions, registrations, spotRanges } from ".";

export const happenings = sqliteTable(
  "happening",
  {
    id: text("id").notNull(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    type: text("type", { enum: happeningTypeEnum }).notNull().default("event"),
    date: integer("date", { mode: "timestamp" }),
    registrationGroups: blob("registration_groups", { mode: "json" }).$type<Array<string>>(),
    registrationStartGroups: integer("registration_start_groups", { mode: "timestamp" }),
    registrationStart: integer("registration_start", { mode: "timestamp" }),
    registrationEnd: integer("registration_end", { mode: "timestamp" }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
    slugIdx: index("slug_idx").on(table.slug),
  }),
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
