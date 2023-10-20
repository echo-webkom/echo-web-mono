import { relations } from "drizzle-orm";
import { pgTable, primaryKey, varchar } from "drizzle-orm/pg-core";

import { groups, happenings } from ".";

export const happeningsToGroups = pgTable(
  "happenings_to_groups",
  {
    happeningSlug: varchar("happening_slug", { length: 255 })
      .notNull()
      .references(() => happenings.slug),
    groupId: varchar("group_id", { length: 21 })
      .notNull()
      .references(() => groups.id),
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
