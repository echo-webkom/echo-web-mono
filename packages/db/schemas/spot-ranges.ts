import { relations } from "drizzle-orm";
import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { nanoid } from "nanoid";

import { happenings } from ".";

export const spotRanges = pgTable("spot_range", {
  id: varchar("id", { length: 21 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => nanoid()),
  happeningSlug: varchar("happening_slug", { length: 255 })
    .notNull()
    .references(() => happenings.slug),
  spots: integer("spots").notNull(),
  minYear: integer("min_year").notNull(),
  maxYear: integer("max_year").notNull(),
});

export const spotRangesRelations = relations(spotRanges, ({ one }) => ({
  event: one(happenings, {
    fields: [spotRanges.happeningSlug],
    references: [happenings.slug],
  }),
}));

export type SpotRange = (typeof spotRanges)["$inferSelect"];
export type SpotRangeInsert = (typeof spotRanges)["$inferInsert"];

export const selectSpotRangeSchema = createSelectSchema(spotRanges);
export const insertSpotRangeSchema = createInsertSchema(spotRanges);
