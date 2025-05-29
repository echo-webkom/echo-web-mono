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
  banInfos,
  comments,
  degrees,
  dots,
  usersToGroups,
  usersToShoppingListItems,
  userTypeEnum,
} from ".";

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
    lastSignInAt: timestamp("last_sign_in_at"),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
    createdAt: timestamp("created_at").$defaultFn(() => new Date()),
    hasReadTerms: boolean("has_read_terms").notNull().default(false),
    birthday: date("birthday", { mode: "date" }),
  },
  (table) => [primaryKey({ columns: [table.id] }), index("email_idx").on(table.email)],
);

export const usersRelations = relations(users, ({ one, many }) => ({
  degree: one(degrees, {
    fields: [users.degreeId],
    references: [degrees.id],
  }),
  memberships: many(usersToGroups),
  likes: many(usersToShoppingListItems),
  dots: many(dots, {
    relationName: "dots",
  }),
  comments: many(comments),
  banInfo: one(banInfos, {
    fields: [users.id],
    references: [banInfos.userId],
    relationName: "banInfo",
  }),
}));

export type User = InferSelectModel<typeof users>;
export type UserInsert = InferInsertModel<typeof users>;

export const selectUserSchema = createSelectSchema(users);
export const insertUserSchema = createInsertSchema(users);
