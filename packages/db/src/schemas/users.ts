import { relations, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import {
  boolean,
  date,
  index,
  integer,
  pgTable,
  primaryKey,
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
    bannedFromStrike: integer("banned_from_strike"),
    lastSignInAt: timestamp("last_sign_in_at"),
    updatedAt: timestamp("updated_at").$onUpdate(now),
    createdAt: timestamp("created_at").$defaultFn(now),
    hasReadTerms: boolean("has_read_terms").notNull().default(false),
    birthday: date("birthday", {mode:"date"})
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
    emailIdx: index("email_idx").on(table.email),
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
  comments: many(comments),
}));

export type User = InferSelectModel<typeof users>;
export type UserInsert = InferInsertModel<typeof users>;

export const selectUserSchema = createSelectSchema(users);
export const insertUserSchema = createInsertSchema(users);
