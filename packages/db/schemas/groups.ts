import { relations } from "drizzle-orm";
import { pgTable, primaryKey, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { nanoid } from "nanoid";

import { happeningsToGroups, users } from ".";
import { usersToGroups } from "./users-to-groups";

export const groups = pgTable(
  "group",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .$defaultFn(() => nanoid()),
    name: varchar("name", { length: 255 }).notNull(),
    leader: text("leader").references(() => users.id),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
  }),
);

export const groupsRelations = relations(groups, ({ one, many }) => ({
  leaderUser: one(users, {
    fields: [groups.leader],
    references: [users.id],
    relationName: "group_leader",
  }),
  members: many(usersToGroups),
  happenings: many(happeningsToGroups),
}));

export type Group = (typeof groups)["$inferSelect"];
export type GroupInsert = (typeof groups)["$inferInsert"];

export const selectGroupSchema = createSelectSchema(groups);
export const insertGroupSchema = createInsertSchema(groups);
