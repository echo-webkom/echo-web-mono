import { relations, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { groups, happenings } from ".";

export const happeningsToGroups = sqliteTable(
  "happenings_to_groups",
  {
    happeningId: text("happening_id")
      .notNull()
      .references(() => happenings.id, {
        onDelete: "cascade",
      }),
    groupId: text("group_id")
      .notNull()
      .references(() => groups.id, {
        onDelete: "cascade",
      }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.happeningId, table.groupId] }),
  }),
);

export const happeningsToGroupsRelations = relations(happeningsToGroups, ({ one }) => ({
  happening: one(happenings, {
    fields: [happeningsToGroups.happeningId],
    references: [happenings.id],
  }),
  group: one(groups, {
    fields: [happeningsToGroups.groupId],
    references: [groups.id],
  }),
}));

export type HappeningsToGroups = InferSelectModel<typeof happeningsToGroups>;
export type HappeningsToGroupsInsert = InferInsertModel<typeof happeningsToGroups>;

export const selectHappeningsToGroupsSchema = createSelectSchema(happeningsToGroups);
export const insertHappeningsToGroupsSchema = createInsertSchema(happeningsToGroups);
