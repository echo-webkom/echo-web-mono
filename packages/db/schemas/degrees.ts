import { relations } from "drizzle-orm";
import { pgTable, primaryKey, varchar } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

import { users } from ".";

export const degrees = pgTable(
  "degree",
  {
    id: varchar("id", { length: 21 })
      .notNull()
      .$defaultFn(() => nanoid()),
    name: varchar("name", { length: 255 }).notNull(),
  },
  (table) => ({
    pk: primaryKey(table.id),
  }),
);

export const degreesRelations = relations(degrees, ({ many }) => ({
  users: many(users),
}));

export type Degree = (typeof degrees)["$inferSelect"];
export type DegreeInsert = (typeof degrees)["$inferInsert"];
