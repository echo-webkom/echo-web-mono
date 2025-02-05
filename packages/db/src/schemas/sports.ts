import { type InferSelectModel } from "drizzle-orm";
import { pgTable, serial, text } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const sports = pgTable("sport", {
  id: serial("id").notNull().primaryKey(),
  name: text("name").notNull(),
});

export type Sport = InferSelectModel<typeof sports>;
export type SportInsert = InferSelectModel<typeof sports>;

export const selectSportSchema = createSelectSchema(sports);
export const insertSportSchema = createInsertSchema(sports);
