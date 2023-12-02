import { relations } from "drizzle-orm";
import { integer, pgTable, primaryKey, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { nanoid } from "nanoid";

import { happenings } from ".";

export const spotRanges = pgTable(
  "spot_range",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .$defaultFn(() => nanoid()),
    happeningId: varchar("happening_id", { length: 255 })
      .notNull()
      .references(() => happenings.id, {
        onDelete: "cascade",
      }),
    spots: integer("spots").notNull(),
    minYear: integer("min_year").notNull(),
    maxYear: integer("max_year").notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
    indexes: uniqueIndex("happening_id_min_year_max_year").on(
      table.happeningId,
      table.minYear,
      table.maxYear,
    ),
  }),
);

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
