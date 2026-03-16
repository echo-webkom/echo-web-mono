import { type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const quotes = pgTable("quote", {
  id: text("id").notNull().primaryKey(),
  text: text("text").notNull(),
  context: text("context"),
  person: text("person").notNull(),
  submittedBy: text("submitted_by").notNull(),
  submittedAt: timestamp("submitted_at").notNull(),
}).enableRLS();

export type Quote = InferSelectModel<typeof quotes>;
export type QuoteInsert = InferInsertModel<typeof quotes>;

export const selectQuoteSchema = createSelectSchema(quotes);
export const insertQuoteSchema = createInsertSchema(quotes);
