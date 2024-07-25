import { relations, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { boolean, pgTable, primaryKey, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { groups, users } from ".";

export const usersToGroups = pgTable(
  "users_to_groups",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    groupId: varchar("group_id", { length: 255 })
      .notNull()
      .references(() => groups.id, {
        onDelete: "cascade",
      }),
    isLeader: boolean("is_leader").notNull().default(false),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.groupId] }),
  }),
);

export const usersToGroupsRelations = relations(usersToGroups, ({ one }) => ({
  user: one(users, {
    fields: [usersToGroups.userId],
    references: [users.id],
  }),
  group: one(groups, {
    fields: [usersToGroups.groupId],
    references: [groups.id],
  }),
}));

export type UsersToGroups = InferSelectModel<typeof usersToGroups>;
export type UsersToGroupsInsert = InferInsertModel<typeof usersToGroups>;

export const selectUsersToGroupsSchema = createSelectSchema(usersToGroups);
export const insertUsersToGroupsSchema = createInsertSchema(usersToGroups);
