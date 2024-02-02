import { relations, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { nanoid } from "nanoid";

import { happenings } from ".";

export const spotRanges = sqliteTable(
  "spot_range",
  {
    id: text("id").notNull().$defaultFn(nanoid),
    happeningId: text("happening_id")
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
  }),
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
