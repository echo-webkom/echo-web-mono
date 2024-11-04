import { relations, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { pgTable, primaryKey, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { nanoid } from "nanoid";

import { happeningsToGroups } from ".";
import { usersToGroups } from "./users-to-groups";

export const groups = pgTable(
  "group",
  {
    id: varchar({ length: 255 })
      .notNull()
      .$defaultFn(() => nanoid()),
    name: varchar({ length: 255 }).notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
  }),
);

export const groupsRelations = relations(groups, ({ many }) => ({
  members: many(usersToGroups),
  happenings: many(happeningsToGroups),
}));

export type Group = InferSelectModel<typeof groups>;
export type GroupInsert = InferInsertModel<typeof groups>;

export const selectGroupSchema = createSelectSchema(groups);
export const insertGroupSchema = createInsertSchema(groups);
