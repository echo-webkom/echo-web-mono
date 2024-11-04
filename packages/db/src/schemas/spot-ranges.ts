import { relations, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { integer, pgTable, primaryKey, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { nanoid } from "nanoid";

import { happenings } from ".";

export const spotRanges = pgTable(
  "spot_range",
  {
    id: varchar({ length: 255 })
      .notNull()
      .$defaultFn(() => nanoid()),
    happeningId: varchar({ length: 255 })
      .notNull()
      .references(() => happenings.id, {
        onDelete: "cascade",
      }),
    spots: integer().notNull(),
    minYear: integer().notNull(),
    maxYear: integer().notNull(),
  },
  (table) => [primaryKey({ columns: [table.id] })],
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
