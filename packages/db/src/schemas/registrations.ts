import { relations, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { answers, happenings, registrationStatusEnum, users } from ".";
import { now } from "../utils";

export const registrations = sqliteTable(
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
    status: text("status", { enum: registrationStatusEnum }).notNull().default("waiting"),
    unregisterReason: text("unregister_reason"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(now),
    prevStatus: text("prev_status", { enum: registrationStatusEnum }),
    changedAt: integer("changed_at", { mode: "timestamp" }).$onUpdate(now),
    changedBy: text("changed_by"),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.happeningId] }),
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
  changedByUser: one(users, {
    fields: [registrations.changedBy],
    references: [users.id],
  }),
}));

export type Registration = InferSelectModel<typeof registrations>;
export type RegistrationInsert = InferInsertModel<typeof registrations>;

export const selectRegistrationSchema = createSelectSchema(registrations);
export const insertRegistrationSchema = createInsertSchema(registrations);
