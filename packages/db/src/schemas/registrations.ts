import { relations, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { answers, happenings, registrationStatusEnum, users } from ".";

export const registrations = pgTable(
  "registration",
  {
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: "no action" }),
    happeningId: text()
      .notNull()
      .references(() => happenings.id, {
        onDelete: "cascade",
      }),
    status: registrationStatusEnum().notNull().default("waiting"),
    unregisterReason: text(),
    createdAt: timestamp().notNull().defaultNow(),
    prevStatus: registrationStatusEnum(),
    changedAt: timestamp().$onUpdate(() => new Date()),
    changedBy: text(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.happeningId] })],
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
  changedByUser: one(users, {
    fields: [registrations.changedBy],
    references: [users.id],
  }),
}));

export type Registration = InferSelectModel<typeof registrations>;
export type RegistrationInsert = InferInsertModel<typeof registrations>;

export const selectRegistrationSchema = createSelectSchema(registrations);
export const insertRegistrationSchema = createInsertSchema(registrations);
