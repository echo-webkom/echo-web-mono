import { relations } from "drizzle-orm";
import { integer, pgTable, uuid, varchar } from "drizzle-orm/pg-core";

import { yearEnum } from "./enums";
import { happenings } from "./happenings";

export const spotRanges = pgTable("spot_range", {
  id: uuid("id").notNull().defaultRandom().primaryKey(),
  happeningSlug: varchar("happening_slug", { length: 255 }).notNull(),
  minYear: yearEnum("min_year").notNull(),
  maxYear: yearEnum("max_year").notNull(),
  spots: integer("spots").notNull(),
});

export const spotRangesRelations = relations(spotRanges, ({ one }) => ({
  happening: one(happenings, {
    fields: [spotRanges.happeningSlug],
    references: [happenings.slug],
  }),
}));
