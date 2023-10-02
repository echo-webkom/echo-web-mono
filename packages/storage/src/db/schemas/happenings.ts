import { relations } from "drizzle-orm";
import { pgTable, primaryKey, timestamp, varchar } from "drizzle-orm/pg-core";

import { happeningTypeEnum } from "./enums";
import { questions } from "./questions";
import { registrations } from "./registrations";
import { spotRanges } from "./spot-ranges";

export const happenings = pgTable(
  "happening",
  {
    slug: varchar("slug", { length: 255 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    type: happeningTypeEnum("type").notNull(),
    date: timestamp("date", {
      withTimezone: true,
    }),
    registrationStart: timestamp("registration_start", {
      withTimezone: true,
    }),
    registrationEnd: timestamp("registration_end", {
      withTimezone: true,
    }),
  },
  (h) => ({
    primaryKey: primaryKey(h.slug),
  }),
);

export const happeningsRelations = relations(happenings, ({ many }) => ({
  spotRanges: many(spotRanges),
  questions: many(questions),
  registrations: many(registrations),
}));
