import { relations, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { answers, happenings, registrationStatusEnum, users } from ".";

export const registrations = pgTable(
  "registration",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "no action" }),
    happeningId: text("happening_id")
      .notNull()
      .references(() => happenings.id, {
        onDelete: "cascade",
      }),
    status: registrationStatusEnum("status").notNull().default("waiting"),
    unregisterReason: text("unregister_reason"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    prevStatus: registrationStatusEnum("prev_status"),
    changedAt: timestamp("changed_at").$onUpdate(() => new Date()),
    changedBy: text("changed_by"),
  },
  (t) => [primaryKey({ columns: [t.userId, t.happeningId] })],
).enableRLS();

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
