import { type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { pgTable, primaryKey, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { groups } from "./groups";
import { happenings } from "./happenings";

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
).enableRLS();

export type HappeningsToGroups = InferSelectModel<typeof happeningsToGroups>;
export type HappeningsToGroupsInsert = InferInsertModel<typeof happeningsToGroups>;

export const selectHappeningsToGroupsSchema = createSelectSchema(happeningsToGroups);
export const insertHappeningsToGroupsSchema = createInsertSchema(happeningsToGroups);
