import { type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import {
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { users } from "./users";

export const userTrophies = pgTable(
  "user_trophies",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    trophyId: varchar("trophy_id", { length: 255 }).notNull(),
    level: integer("level").notNull().default(1),
    awardedAt: timestamp("awarded_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    awardedBy: text("awarded_by").references(() => users.id, {
      onDelete: "set null",
    }),
  },
  (t) => [primaryKey({ columns: [t.userId, t.trophyId] })],
).enableRLS();

export type UserTrophy = InferSelectModel<typeof userTrophies>;
export type UserTrophyInsert = InferInsertModel<typeof userTrophies>;

export const selectUserTrophySchema = createSelectSchema(userTrophies);
export const insertUserTrophySchema = createInsertSchema(userTrophies);
