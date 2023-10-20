import { relations } from "drizzle-orm";
import { index, pgTable, primaryKey, text, varchar } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

import { happenings, registrationStatusEnum, users } from ".";

export const registrations = pgTable(
  "registration",
  {
    id: varchar("id", { length: 21 })
      .notNull()
      .$defaultFn(() => nanoid()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    happeningSlug: text("happening_slug")
      .notNull()
      .references(() => happenings.slug),
    status: registrationStatusEnum("status").notNull().default("waiting"),
    unregisterReason: text("unregister_reason"),
  },
  (table) => ({
    pk: primaryKey(table.id),
    statusIdx: index("status_idx").on(table.status),
  }),
);

export const registrationsRelations = relations(registrations, ({ one }) => ({
  happening: one(happenings, {
    fields: [registrations.happeningSlug],
    references: [happenings.slug],
  }),
  user: one(users, {
    fields: [registrations.userId],
    references: [users.id],
  }),
}));

export type Registration = (typeof registrations)["$inferSelect"];
export type RegistrationInsert = (typeof registrations)["$inferInsert"];
