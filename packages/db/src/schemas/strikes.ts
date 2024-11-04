import { relations, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { boolean, index, pgTable, serial, text, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { strikeInfos, users } from ".";

export const strikes = pgTable(
  "strike",
  {
    id: serial().notNull().primaryKey(),
    userId: text()
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    strikeInfoId: uuid()
      .notNull()
      .references(() => strikeInfos.id, { onDelete: "cascade" }),
    isDeleted: boolean().notNull().default(false),
  },
  (table) => [index("user_idx").on(table.userId, table.id)],
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
