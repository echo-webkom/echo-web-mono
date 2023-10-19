import { gte, relations } from "drizzle-orm";
import { check, index, pgTable, primaryKey, timestamp, varchar } from "drizzle-orm/pg-core";

import { happeningTypeEnum, questions, registrations, spotRanges } from ".";

export const happenings = pgTable(
  "happening",
  {
    slug: varchar("slug", { length: 255 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    type: happeningTypeEnum("type").notNull().default("event"),
    date: timestamp("date"),
    registrationStart: timestamp("registration_start"),
    registrationEnd: timestamp("registration_end"),
  },
  (e) => ({
    pk: primaryKey(e.slug),
    typeIdx: index("type_idx").on(e.type),
    checkRegistration: check(
      "registration_end_after_start",
      gte(e.registrationEnd, e.registrationStart),
    ),
  }),
);

export const happeningsRelations = relations(happenings, ({ many }) => ({
  registrations: many(registrations),
  spotRanges: many(spotRanges),
  questions: many(questions),
}));

export type Happening = (typeof happenings)["$inferSelect"];
export type HappeningInsert = (typeof happenings)["$inferInsert"];
