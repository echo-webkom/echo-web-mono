import { relations } from "drizzle-orm";
import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";

import { groupEnum } from "./enums";
import { users } from "./users";

export const userGroupMemberships = pgTable(
  "user_group_membership",
  {
    id: groupEnum("id").notNull(),
    userId: uuid("user_id").notNull(),
  },
  (ugm) => ({
    compoundKey: primaryKey(ugm.userId, ugm.id),
  }),
);

export const userGroupMembershipsRelations = relations(userGroupMemberships, ({ one }) => ({
  user: one(users, {
    fields: [userGroupMemberships.userId],
    references: [users.id],
  }),
}));
