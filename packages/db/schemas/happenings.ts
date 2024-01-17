import { relations } from "drizzle-orm";
import { json, pgTable, primaryKey, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { happeningsToGroups, happeningTypeEnum, questions, registrations, spotRanges } from ".";

export const happenings = pgTable(
  "happening",
  {
    id: varchar("id", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    title: varchar("title", { length: 255 }).notNull(),
    type: happeningTypeEnum("type").notNull().default("event"),
    date: timestamp("date"),
    registrationGroups: json("registration_groups").$type<Array<string>>(),
    registrationStartGroups: timestamp("registration_start_groups"),
    registrationStart: timestamp("registration_start"),
    registrationEnd: timestamp("registration_end"),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
  }),
);

export const happeningsRelations = relations(happenings, ({ many }) => ({
  registrations: many(registrations),
  spotRanges: many(spotRanges),
  questions: many(questions),
  groups: many(happeningsToGroups),
}));

export type Happening = (typeof happenings)["$inferSelect"];
export type HappeningInsert = (typeof happenings)["$inferInsert"];

export const selectHappeningSchema = createSelectSchema(happenings);
export const insertHappeningSchema = createInsertSchema(happenings);
