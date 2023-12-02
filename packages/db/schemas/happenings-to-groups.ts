import { relations } from "drizzle-orm";
import { pgTable, primaryKey, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { groups, happenings } from ".";

export const happeningsToGroups = pgTable(
  "happenings_to_groups",
  {
    // Don't use `.refrences` to avoid foreign key constraints
    happeningId: varchar("happening_id", { length: 255 }).notNull(),
    // Don't use `.refrences` to avoid foreign key constraints
    groupId: varchar("group_id", { length: 255 }).notNull(),
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

export type HappeningsToGroups = (typeof happeningsToGroups)["$inferSelect"];
export type HappeningsToGroupsInsert = (typeof happeningsToGroups)["$inferInsert"];

export const selectHappeningsToGroupsSchema = createSelectSchema(happeningsToGroups);
export const insertHappeningsToGroupsSchema = createInsertSchema(happeningsToGroups);
