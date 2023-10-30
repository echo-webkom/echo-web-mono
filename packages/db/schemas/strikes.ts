import { relations } from "drizzle-orm";
import { integer, pgTable, primaryKey, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { happenings, users } from ".";

export const strikes = pgTable(
  "strike",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    happeningSlug: varchar("happening_slug", { length: 255 })
      .notNull()
      .references(() => happenings.slug),
    reason: text("reason").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    amount: integer("amount").notNull().default(1),
  },
  (table) => ({
    pk: primaryKey(table.userId, table.happeningSlug),
  }),
);

export const strikesRelations = relations(strikes, ({ one }) => ({
  user: one(users, {
    fields: [strikes.userId],
    references: [users.id],
  }),
  happening: one(happenings, {
    fields: [strikes.happeningSlug],
    references: [happenings.slug],
  }),
}));

export type Strike = (typeof strikes)["$inferSelect"];
export type StrikeInsert = (typeof strikes)["$inferInsert"];

export const selectStrikeSchema = createSelectSchema(strikes);
export const insertStrikeSchema = createInsertSchema(strikes);
