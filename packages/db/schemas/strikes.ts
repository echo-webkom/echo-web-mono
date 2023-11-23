import { relations } from "drizzle-orm";
import { pgTable, serial, text } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { strikeInfo } from "./strike-info";

export const strikes = pgTable("strike", {
  id: serial("id").notNull().primaryKey(),
  strikeInfoId: text("info")
    .notNull()
    .references(() => strikeInfo.id, { onDelete: "cascade" }),
});

export const strikesRelations = relations(strikes, ({ one }) => ({
  strikeInfo: one(strikeInfo, {
    fields: [strikes.strikeInfoId],
    references: [strikeInfo.id],
  }),
}));

export type Strike = (typeof strikes)["$inferSelect"];
export type StrikeInsert = (typeof strikes)["$inferInsert"];

export const selectStrikeSchema = createSelectSchema(strikes);
export const insertStrikeSchema = createInsertSchema(strikes);
