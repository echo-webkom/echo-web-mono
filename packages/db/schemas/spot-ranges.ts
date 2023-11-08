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
  happeningId: varchar("happening_id", { length: 36 })
    .notNull()
    .references(() => happenings.id),
  spots: integer("spots").notNull(),
  minYear: integer("min_year").notNull(),
  maxYear: integer("max_year").notNull(),
});

export const spotRangesRelations = relations(spotRanges, ({ one }) => ({
  event: one(happenings, {
    fields: [spotRanges.happeningId],
    references: [happenings.id],
  }),
}));

export type SpotRange = (typeof spotRanges)["$inferSelect"];
export type SpotRangeInsert = (typeof spotRanges)["$inferInsert"];

export const selectSpotRangeSchema = createSelectSchema(spotRanges);
export const insertSpotRangeSchema = createInsertSchema(spotRanges);
