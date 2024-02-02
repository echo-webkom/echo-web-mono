import { relations, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { strikeInfos, users } from ".";

export const strikes = sqliteTable(
  "strike",
  {
    id: integer("id").notNull().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    strikeInfoId: text("strike_info_id")
      .notNull()
      .references(() => strikeInfos.id, { onDelete: "cascade" }),
    isDeleted: integer("is_deleted", { mode: "boolean" }).notNull().default(false),
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

export type Strike = InferSelectModel<typeof strikes>;
export type StrikeInsert = InferInsertModel<typeof strikes>;

export const selectStrikeSchema = createSelectSchema(strikes);
export const insertStrikeSchema = createInsertSchema(strikes);
