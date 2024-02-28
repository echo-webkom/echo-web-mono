import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { happenings, users } from ".";

export const strikeInfos = pgTable("strike_info", {
  id: uuid("id").defaultRandom().primaryKey(),
  happeningId: varchar("happening_id", { length: 255 })
    .notNull()
    .references(() => happenings.id),
  issuerId: text("issuer_id")
    .notNull()
    .references(() => users.id),
  reason: text("reason").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
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

export type StrikeInfo = (typeof strikeInfos)["$inferSelect"];
export type StrikeInfoInsert = (typeof strikeInfos)["$inferInsert"];

export const selectStrikeInfoSchema = createSelectSchema(strikeInfos);
export const insertStrikeInfoSchema = createInsertSchema(strikeInfos);
