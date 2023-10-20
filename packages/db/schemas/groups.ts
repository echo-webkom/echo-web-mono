import { relations } from "drizzle-orm";
import { pgTable, primaryKey, text, varchar } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

import { happeningsToGroups, users } from ".";
import { usersToGroups } from "./users-to-groups";

export const groups = pgTable(
  "group",
  {
    id: varchar("id", { length: 21 })
      .notNull()
      .$defaultFn(() => nanoid()),
    name: varchar("name", { length: 255 }).notNull(),
    leader: text("leader").references(() => users.id),
  },
  (table) => ({
    pk: primaryKey(table.id),
  }),
);

export const groupsRelations = relations(groups, ({ one, many }) => ({
  leader: one(users, {
    fields: [groups.leader],
    references: [users.id],
    relationName: "group_leader",
  }),
  members: many(usersToGroups),
  happenings: many(happeningsToGroups),
}));

export type Group = (typeof groups)["$inferSelect"];
export type GroupInsert = (typeof groups)["$inferInsert"];
