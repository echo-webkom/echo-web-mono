import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { degrees, strikes, usersToGroups, usersToShoppingListItems, userTypeEnum } from ".";

export const users = pgTable(
  "user",
  {
    id: text("id").notNull(),
    name: text("name"),
    email: text("email").notNull(),
    emailVerified: timestamp("email_verified", { mode: "date" }),
    image: text("image"),
    alternativeEmail: varchar("alternative_email", { length: 255 }),
    degreeId: varchar("degree_id", { length: 255 }).references(() => degrees.id),
    year: integer("year"),
    type: userTypeEnum("type").notNull().default("student"),
    isBanned: boolean("is_banned").notNull().default(false),
    bannedFromStrike: integer("strike_id"),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
  }),
);

export const usersRelations = relations(users, ({ one, many }) => ({
  degree: one(degrees, {
    fields: [users.degreeId],
    references: [degrees.id],
  }),
  memberships: many(usersToGroups),
  likes: many(usersToShoppingListItems),
  strikes: many(strikes),
  bannedFromStrike: one(strikes, {
    fields: [users.bannedFromStrike],
    references: [strikes.id],
  }),
}));

export type User = (typeof users)["$inferSelect"];
export type UserInsert = (typeof users)["$inferInsert"];

export const selectUserSchema = createSelectSchema(users);
export const insertUserSchema = createInsertSchema(users);
