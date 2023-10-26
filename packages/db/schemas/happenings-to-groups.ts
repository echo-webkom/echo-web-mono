import { relations } from "drizzle-orm";
import { pgTable, primaryKey, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { groups, happenings } from ".";

export const happeningsToGroups = pgTable(
  "happenings_to_groups",
  {
    // Don't use `.refrences` to avoid foreign key constraints
    happeningSlug: varchar("happening_slug", { length: 255 }).notNull(),
    // Don't use `.refrences` to avoid foreign key constraints
    groupId: varchar("group_id", { length: 21 }).notNull(),
  },
  (table) => ({
    pk: primaryKey(table.happeningSlug, table.groupId),
  }),
);

export const happeningsToGroupsRelations = relations(happeningsToGroups, ({ one }) => ({
  happening: one(happenings, {
    fields: [happeningsToGroups.happeningSlug],
    references: [happenings.slug],
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
