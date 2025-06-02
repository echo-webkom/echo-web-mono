import { relations, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { pgTable, primaryKey, varchar } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

import { users } from ".";

export const degrees = pgTable(
  "degree",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .$defaultFn(() => nanoid()),
    name: varchar("name", { length: 255 }).notNull(),
  },
  (degree) => [primaryKey({ columns: [degree.id] })],
);

export const degreesRelations = relations(degrees, ({ many }) => ({
  users: many(users),
}));

export type Degree = InferSelectModel<typeof degrees>;
export type DegreeInsert = InferInsertModel<typeof degrees>;
