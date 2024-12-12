import { relations, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import {
  boolean,
  date,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import {
  comments,
  degrees,
  strikes,
  usersToGroups,
  usersToShoppingListItems,
  userTypeEnum,
} from ".";
import { now } from "../utils";

export const users = pgTable(
  "user",
  {
    id: text().notNull().primaryKey(),
    name: text(),
    email: text().notNull(),
    emailVerified: timestamp({ mode: "date" }),
    image: text(),
    alternativeEmail: varchar({ length: 255 }),
    degreeId: varchar({ length: 255 }).references(() => degrees.id),
    year: integer(),
    type: userTypeEnum().notNull().default("student"),
    isBanned: boolean().notNull().default(false),
    bannedFromStrike: integer(),
    lastSignInAt: timestamp(),
    updatedAt: timestamp().$onUpdate(now),
    createdAt: timestamp().$defaultFn(now),
    hasReadTerms: boolean().notNull().default(false),
    birthday: date({ mode: "date" }),
  },
  (table) => [index("email_idx").on(table.email)],
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
  comments: many(comments),
}));

export type User = InferSelectModel<typeof users>;
export type UserInsert = InferInsertModel<typeof users>;

export const selectUserSchema = createSelectSchema(users);
export const insertUserSchema = createInsertSchema(users);
