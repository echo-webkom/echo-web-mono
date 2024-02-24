import { relations } from "drizzle-orm";
import { boolean, index, pgTable, serial, text, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { strikeInfos, users } from ".";

export const strikes = pgTable(
  "strike",
  {
    id: serial("id").notNull().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    strikeInfoId: uuid("strike_info_id")
      .notNull()
      .references(() => strikeInfos.id, { onDelete: "cascade" }),
    isDeleted: boolean("is_deleted").notNull().default(false),
  },
  (table) => ({
    userIdx: index("user_idx").on(table.userId, table.id),
  }),
);

export const strikesRelations = relations(strikes, ({ one }) => ({
  user: one(users, {
    fields: [strikes.userId],
    references: [users.id],
  }),
  strikeInfo: one(strikeInfos, {
    fields: [strikes.strikeInfoId],
    references: [strikeInfos.id],
  }),
}));

export type Strike = (typeof strikes)["$inferSelect"];
export type StrikeInsert = (typeof strikes)["$inferInsert"];

export const selectStrikeSchema = createSelectSchema(strikes);
export const insertStrikeSchema = createInsertSchema(strikes);
