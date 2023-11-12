import { relations } from "drizzle-orm";
import { index, pgTable, primaryKey, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { answers, happenings, registrationStatusEnum, spotRanges, users } from ".";

export const registrations = pgTable(
  "registration",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    happeningId: text("happening_id")
      .notNull()
      .references(() => happenings.id, {
        onDelete: "cascade",
      }),
    spotRangeId: varchar("spot_range_id").references(() => spotRanges.id, {
      onDelete: "cascade",
    }),
    status: registrationStatusEnum("status").notNull().default("waiting"),
    unregisterReason: text("unregister_reason"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
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
  spotRange: one(spotRanges, {
    fields: [registrations.spotRangeId],
    references: [spotRanges.id],
  }),
  answers: many(answers),
}));

export type Registration = (typeof registrations)["$inferSelect"];
export type RegistrationInsert = (typeof registrations)["$inferInsert"];

export const selectRegistrationSchema = createSelectSchema(registrations);
export const insertRegistrationSchema = createInsertSchema(registrations);
