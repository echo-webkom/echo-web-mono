import { relations } from "drizzle-orm";
import { integer, pgTable, primaryKey, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { degrees, groups, usersToGroups, userTypeEnum } from ".";
import { usersToShoppingListItems } from "./users_to_shopping_list_items";
import { degrees, usersToGroups, userTypeEnum } from ".";

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
  likes: many(usersToShoppingListItems)
}));

export type User = (typeof users)["$inferSelect"];
export type UserInsert = (typeof users)["$inferInsert"];

export const selectUserSchema = createSelectSchema(users);
export const insertUserSchema = createInsertSchema(users);
