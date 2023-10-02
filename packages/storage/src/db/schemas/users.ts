import { relations } from "drizzle-orm";
import { pgTable, primaryKey, unique, uuid, varchar } from "drizzle-orm/pg-core";

import { accountTypeEnum, degreeEnum, yearEnum } from "./enums";
import { passwords } from "./passwords";
import { registrations } from "./registrations";
import { userGroupMemberships } from "./user-group-memberships";

export const users = pgTable(
  "user",
  {
    id: uuid("id").defaultRandom().notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    firstName: varchar("firstName", { length: 255 }).notNull(),
    lastName: varchar("lastName", { length: 255 }).notNull(),
    studentMail: varchar("student_mail", { length: 255 }),
    type: accountTypeEnum("account_type").notNull().default("guest"),
    degree: degreeEnum("degree"),
    year: yearEnum("year"),
  },
  (u) => ({
    primaryKey: primaryKey(u.id),
    unique_email: unique().on(u.email),
  }),
);

export const usersRelations = relations(users, ({ many }) => ({
  passwords: many(passwords),
  groups: many(userGroupMemberships),
  registrations: many(registrations),
}));
