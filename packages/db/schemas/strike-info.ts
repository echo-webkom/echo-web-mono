import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { happenings, users } from ".";

export const strikeInfo = pgTable("strikeInfo", {
  id: uuid("id").defaultRandom().primaryKey(),
  happeningSlug: varchar("happening_slug", { length: 255 })
    .notNull()
    .references(() => happenings.slug),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  issuerId: text("reporter-id")
    .notNull()
    .references(() => users.id),
  reason: text("reason").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const strikesRelations = relations(strikeInfo, ({ one }) => ({
  user: one(users, {
    fields: [strikeInfo.userId],
    references: [users.id],
  }),
  issuer: one(users, {
    fields: [strikeInfo.issuerId],
    references: [users.id],
  }),
  happening: one(happenings, {
    fields: [strikeInfo.happeningSlug],
    references: [happenings.slug],
  }),
}));

export type StrikeInfo = (typeof strikeInfo)["$inferSelect"];
export type StrikeInfoInsert = (typeof strikeInfo)["$inferInsert"];

export const selectStrikeSchema = createSelectSchema(strikeInfo);
export const insertStrikeSchema = createInsertSchema(strikeInfo);
