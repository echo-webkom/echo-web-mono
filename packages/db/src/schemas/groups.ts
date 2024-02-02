import { relations, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { nanoid } from "nanoid";

import { happeningsToGroups, usersToGroups } from ".";

export const groups = sqliteTable(
  "group",
  {
    id: text("id", { length: 255 })
      .notNull()
      .$defaultFn(() => nanoid()),
    name: text("name", { length: 255 }).notNull(),
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
