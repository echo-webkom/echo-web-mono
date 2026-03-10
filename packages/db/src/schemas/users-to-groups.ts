import { type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { boolean, pgTable, primaryKey, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { groups } from "./groups";
import { users } from "./users";

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
  (t) => [primaryKey({ columns: [t.userId, t.groupId] })],
).enableRLS();

export type UsersToGroups = InferSelectModel<typeof usersToGroups>;
export type UsersToGroupsInsert = InferInsertModel<typeof usersToGroups>;

export const selectUsersToGroupsSchema = createSelectSchema(usersToGroups);
export const insertUsersToGroupsSchema = createInsertSchema(usersToGroups);
