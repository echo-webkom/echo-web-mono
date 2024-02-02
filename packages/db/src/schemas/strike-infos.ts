import { relations, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { nanoid } from "nanoid";

import { happenings, users } from ".";
import { now } from "../utils";

export const strikeInfos = sqliteTable("strike_info", {
  id: text("id").notNull().primaryKey().$defaultFn(nanoid),
  happeningId: text("happening_id")
    .notNull()
    .references(() => happenings.id),
  issuerId: text("issuer_id")
    .notNull()
    .references(() => users.id),
  reason: text("reason").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(now),
});

export const strikeInfoRelations = relations(strikeInfos, ({ one }) => ({
  issuer: one(users, {
    fields: [strikeInfos.issuerId],
    references: [users.id],
  }),
  happening: one(happenings, {
    fields: [strikeInfos.happeningId],
    references: [happenings.id],
  }),
}));

export type StrikeInfo = InferSelectModel<typeof strikeInfos>;
export type StrikeInfoInsert = InferInsertModel<typeof strikeInfos>;

export const selectStrikeInfoSchema = createSelectSchema(strikeInfos);
export const insertStrikeInfoSchema = createInsertSchema(strikeInfos);
