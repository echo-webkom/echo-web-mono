import { relations } from "drizzle-orm";
import { index, pgTable, primaryKey, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { answers, happenings, registrationStatusEnum, spotRanges, users } from ".";

export const registrations = pgTable(
  "registration",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    happeningId: text("happening_id")
      .notNull()
      .references(() => happenings.id),
    status: registrationStatusEnum("status").notNull().default("waiting"),
    unregisterReason: text("unregister_reason"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    spotrangeId: varchar("spotrange_id", { length: 21 }).notNull(),
  },
  (table) => ({
    pk: primaryKey(table.userId, table.happeningId),
    statusIdx: index("status_idx").on(table.status),
  }),
);

export const registrationsRelations = relations(registrations, ({ one, many }) => ({
  happening: one(happenings, {
    fields: [registrations.happeningId],
    references: [happenings.id],
  }),
  user: one(users, {
    fields: [registrations.userId],
    references: [users.id],
  }),
  answers: many(answers),
  spotrange: one(spotRanges, {
    fields: [registrations.spotrangeId],
    references: [spotRanges.id]
  })
}));

export type Registration = (typeof registrations)["$inferSelect"];
export type RegistrationInsert = (typeof registrations)["$inferInsert"];

export const selectRegistrationSchema = createSelectSchema(registrations);
export const insertRegistrationSchema = createInsertSchema(registrations);
