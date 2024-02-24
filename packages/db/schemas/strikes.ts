import { relations } from "drizzle-orm";
import { boolean, pgTable, serial, text, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { strikeInfo, users } from ".";

export const strikes = pgTable("strike", {
  id: serial("id").notNull().primaryKey(),
  userId: text("user-id")
    .notNull()
    .references(() => users.id),
  strikeInfoId: uuid("info")
    .notNull()
    .references(() => strikeInfo.id, { onDelete: "cascade" }),
  isDeleted: boolean("isDeleted").default(false),
});

export const strikesRelations = relations(strikes, ({ one }) => ({
  user: one(users, {
    fields: [strikes.userId],
    references: [users.id],
  }),
  strikeInfo: one(strikeInfo, {
    fields: [strikes.strikeInfoId],
    references: [strikeInfo.id],
  }),
}));

export type Strike = (typeof strikes)["$inferSelect"];
export type StrikeInsert = (typeof strikes)["$inferInsert"];

export const selectStrikeSchema = createSelectSchema(strikes);
export const insertStrikeSchema = createInsertSchema(strikes);
