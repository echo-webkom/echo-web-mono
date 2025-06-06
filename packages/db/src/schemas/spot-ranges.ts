import { relations, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { integer, pgTable, primaryKey, varchar } from "drizzle-orm/pg-core";
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
  (t) => [primaryKey({ columns: [t.id] })],
);

export const spotRangesRelations = relations(spotRanges, ({ one }) => ({
  happening: one(happenings, {
    fields: [spotRanges.happeningId],
    references: [happenings.id],
  }),
}));

export type SpotRange = InferSelectModel<typeof spotRanges>;
export type SpotRangeInsert = InferInsertModel<typeof spotRanges>;

export const selectSpotRangeSchema = createSelectSchema(spotRanges);
export const insertSpotRangeSchema = createInsertSchema(spotRanges);
