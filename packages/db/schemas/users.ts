import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

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
    uniqueEmailIdx: uniqueIndex("unique_email_idx").on(table.email),
    unqiueAlternativeEmailIdx: uniqueIndex("unique_alternative_email_idx").on(
      table.alternativeEmail,
    ),
  }),
);

export const usersRelations = relations(users, ({ one, many }) => ({
  degree: one(degrees, {
    fields: [users.degreeId],
    references: [degrees.id],
  }),
  memberships: many(usersToGroups),
}));

export type User = (typeof users)["$inferSelect"];
export type UserInsert = (typeof users)["$inferInsert"];

export const selectUserSchema = createSelectSchema(users);
export const insertUserSchema = createInsertSchema(users);
