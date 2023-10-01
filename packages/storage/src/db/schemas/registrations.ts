import { relations } from "drizzle-orm";
import { pgTable, uuid, varchar, unique } from "drizzle-orm/pg-core";
import { registrationStatusEnum } from "./enums";
import { happenings } from "./happenings";
import { users } from "./users";
import { spotRanges } from "./spot-ranges";

export const registrations = pgTable(
  "registration",
  {
    id: uuid("id").notNull().defaultRandom().primaryKey(),
    spotRangeId: uuid("spot_range_id").notNull(),
    happeningSlug: varchar("happening_slug", { length: 255 }).notNull(),
    userId: uuid("user_id").notNull(),
    status: registrationStatusEnum("status").notNull().default("unregistered"),
  },
  (r) => ({
    unique_userId_happeningSlug: unique().on(r.userId, r.happeningSlug),
  })
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
  spotRange: one(spotRanges, {
    fields: [registrations.spotRangeId],
    references: [spotRanges.id],
  }),
}));
