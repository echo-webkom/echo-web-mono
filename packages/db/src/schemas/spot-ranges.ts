import { relations, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { integer, pgTable, primaryKey, varchar } from "drizzle-orm/pg-core";
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
  (spotRange) => [primaryKey({ columns: [spotRange.id] })],
);

export const spotRangesRelations = relations(spotRanges, ({ one }) => ({
  happening: one(happenings, {
    fields: [spotRanges.happeningId],
    references: [happenings.id],
  }),
}));

export type SpotRange = InferSelectModel<typeof spotRanges>;
export type SpotRangeInsert = InferInsertModel<typeof spotRanges>;
