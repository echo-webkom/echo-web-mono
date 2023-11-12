import { relations } from "drizzle-orm";
import { integer, pgTable, primaryKey, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { degrees, groups, usersToGroups, userTypeEnum } from ".";

export const users = pgTable(
  "user",
  {
    id: text("id").notNull(),
    name: text("name"),
    email: text("email").notNull(),
    emailVerified: timestamp("email_verified", { mode: "date" }),
    image: text("image"),
    alternativeEmail: varchar("alternative_email"),
    degreeId: varchar("degree_id").references(() => degrees.id),
    year: integer("year"),
    type: userTypeEnum("type").notNull().default("student"),
  },
  (table) => ({
    pk: primaryKey(table.id),
  }),
);

export const usersRelations = relations(users, ({ one, many }) => ({
  degree: one(degrees, {
    fields: [users.degreeId],
    references: [degrees.id],
  }),
  groupLeader: many(groups),
  memberships: many(usersToGroups),
}));

export type User = (typeof users)["$inferSelect"];
export type UserInsert = (typeof users)["$inferInsert"];

export const selectUserSchema = createSelectSchema(users);
export const insertUserSchema = createInsertSchema(users);
