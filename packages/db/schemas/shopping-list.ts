import { relations } from "drizzle-orm";
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { users } from ".";

export const shoppingList = pgTable("shoppingList", {
  itemId: integer("item_id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  itemName: text("item_name").notNull(),
  submitTime: timestamp("timestamp").notNull().defaultNow(),
  likes: integer("likes").default(0).notNull(),
});

export const shoppingListRelations = relations(shoppingList, ({ one }) => ({
  user: one(users, {
    fields: [shoppingList.userId],
    references: [users.id],
  }),
}));

export type ShoppingList = (typeof shoppingList)["$inferSelect"];
export type ShoppingListInsert = (typeof shoppingList)["$inferInsert"];

export const selectRegistrationSchema = createSelectSchema(shoppingList);
export const insertRegistrationSchema = createInsertSchema(shoppingList);
