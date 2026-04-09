import { type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import {
  boolean,
  pgTable,
  primaryKey,
  text,
  varchar,
  integer,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { users } from "./users";

export const usersTrophies = pgTable(
  "users_to_groups",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    trophyId: varchar("group_id", { length: 255 }).notNull(),
    level: integer("trophy_level").notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.trophyId] })],
).enableRLS();

export type UsersTrophies = InferSelectModel<typeof usersTrophies>;
export type UsersTrophiesInsert = InferInsertModel<typeof usersTrophies>;

export const selectUsersTrophiesSchema = createSelectSchema(usersTrophies);
export const insertUsersTrophiesSchema = createInsertSchema(usersTrophies);
