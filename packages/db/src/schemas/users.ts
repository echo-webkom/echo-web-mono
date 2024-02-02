import { relations, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { index, integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
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

export const users = sqliteTable(
  "user",
  {
    id: text("id").notNull(),
    name: text("name"),
    email: text("email").notNull(),
    emailVerified: integer("email_verified", { mode: "timestamp" }),
    image: text("image"),
    alternativeEmail: text("alternative_email"),
    degreeId: text("degree_id").references(() => degrees.id),
    year: integer("year"),
    type: text("type", { enum: userTypeEnum }).notNull().default("student"),
    isBanned: integer("is_banned", { mode: "boolean" }).notNull().default(false),
    bannedFromStrike: integer("banned_from_strike"),
    lastSignInAt: integer("last_sign_in_at", { mode: "timestamp" }),
    updatedAt: integer("updated_at", { mode: "timestamp" }).$onUpdate(now),
    createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(now),
    hasReadTerms: integer("has_read_terms", { mode: "boolean" }).notNull().default(false),
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
