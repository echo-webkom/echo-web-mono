import { relations, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { nanoid } from "nanoid";

import { users } from ".";

export const degrees = sqliteTable(
  "degree",
  {
    id: text("id")
      .notNull()
      .$defaultFn(() => nanoid()),
    name: text("name").notNull(),
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
