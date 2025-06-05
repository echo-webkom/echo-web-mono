import { relations, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { pgTable, primaryKey, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { groups, happenings } from ".";

export const happeningsToGroups = pgTable(
  "happenings_to_groups",
  {
    happeningId: varchar("happening_id", { length: 255 })
      .notNull()
      .references(() => happenings.id, {
        onDelete: "cascade",
      }),
    groupId: varchar("group_id", { length: 255 })
      .notNull()
      .references(() => groups.id, {
        onDelete: "cascade",
      }),
  },
  (t) => [primaryKey({ columns: [t.happeningId, t.groupId] })],
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
