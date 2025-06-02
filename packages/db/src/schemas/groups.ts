import { relations, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { pgTable, primaryKey, varchar } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

import { happeningsToGroups } from ".";
import { usersToGroups } from "./users-to-groups";

export const groups = pgTable(
  "group",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .$defaultFn(() => nanoid()),
    name: varchar("name", { length: 255 }).notNull(),
  },
  (group) => [primaryKey({ columns: [group.id] })],
);

export const groupsRelations = relations(groups, ({ many }) => ({
  members: many(usersToGroups),
  happenings: many(happeningsToGroups),
}));

export type Group = InferSelectModel<typeof groups>;
export type GroupInsert = InferInsertModel<typeof groups>;

