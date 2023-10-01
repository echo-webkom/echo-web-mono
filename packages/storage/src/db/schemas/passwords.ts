import { relations } from "drizzle-orm";
import { pgTable, uuid, varchar, primaryKey } from "drizzle-orm/pg-core";
import { users } from "./users";

export const passwords = pgTable(
  "password",
  {
    userId: uuid("user_id"),
    password: varchar("password", { length: 255 }).notNull(),
  },
  (p) => ({
    primaryKey: primaryKey(p.userId),
  })
);

export const passwordsRelations = relations(passwords, ({ one }) => ({
  user: one(users, {
    fields: [passwords.userId],
    references: [users.id],
  }),
}));
