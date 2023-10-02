import { relations } from "drizzle-orm";
import { pgTable, unique, uuid, varchar } from "drizzle-orm/pg-core";

import { registrationStatusEnum } from "./enums";
import { happenings } from "./happenings";
import { users } from "./users";

export const registrations = pgTable(
  "registration",
  {
    id: uuid("id").notNull().defaultRandom().primaryKey(),
    happeningSlug: varchar("happening_slug", { length: 255 }).notNull(),
    userId: uuid("user_id").notNull(),
    status: registrationStatusEnum("status").notNull().default("unregistered"),
  },
  (r) => ({
    unique_userId_happeningSlug: unique().on(r.userId, r.happeningSlug),
  }),
);

export const registrationsRelations = relations(registrations, ({ one }) => ({
  user: one(users, {
    fields: [registrations.userId],
    references: [users.id],
  }),
  happening: one(happenings, {
    fields: [registrations.happeningSlug],
    references: [happenings.slug],
  }),
}));
