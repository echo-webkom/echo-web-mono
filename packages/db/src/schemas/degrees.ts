import { relations, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { pgTable, primaryKey, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
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
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
  }),
);

export const degreesRelations = relations(degrees, ({ many }) => ({
  users: many(users),
}));

export type Degree = InferSelectModel<typeof degrees>;
export type DegreeInsert = InferInsertModel<typeof degrees>;

export const selectDegreeSchema = createSelectSchema(degrees);
export const insertDegreeSchema = createInsertSchema(degrees);
