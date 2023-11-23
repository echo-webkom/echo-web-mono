import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { happenings, users } from ".";

export const strikeInfo = pgTable("strikeInfo", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  happeningSlug: varchar("happening_slug", { length: 255 })
    .notNull()
    .references(() => happenings.slug),
  issuerId: text("reporter-id")
    .notNull()
    .references(() => users.id),
  reason: text("reason").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const strikeInfoRelations = relations(strikeInfo, ({ one }) => ({
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

export const selectStrikeInfoSchema = createSelectSchema(strikeInfo);
export const insertStrikeInfoSchema = createInsertSchema(strikeInfo);
