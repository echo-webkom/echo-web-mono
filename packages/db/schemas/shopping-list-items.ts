import { relations } from "drizzle-orm";
import {  pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { users } from ".";

export const shoppingListItems = pgTable("shopping_list_item", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const shoppingListItemsRelations = relations(shoppingListItems, ({ one }) => ({
  userId: one(users, {
    fields: [shoppingListItems.userId],
    references: [users.id],
  }),
}));

export type ShoppingListItems = (typeof shoppingListItems)["$inferSelect"];
export type ShoppingListItemsInsert = (typeof shoppingListItems)["$inferInsert"];

export const selectShoppingListItemsSchema = createSelectSchema(shoppingListItems);
export const insertShoppingListItemsSchema = createInsertSchema(shoppingListItems);
