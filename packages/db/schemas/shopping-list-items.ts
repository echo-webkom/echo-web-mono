import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { users } from ".";
import { usersToShoppingListItems } from "./users_to_shopping_list_items";

export const shoppingListItems = pgTable("shopping_list_item", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const shoppingListItemsRelations = relations(shoppingListItems, ({ one, many }) => ({
  userId: one(users, {
    fields: [shoppingListItems.userId],
    references: [users.id],
  }),
  likes: many(usersToShoppingListItems),
}));

export type ShoppingListItems = (typeof shoppingListItems)["$inferSelect"];
export type ShoppingListItemsInsert = (typeof shoppingListItems)["$inferInsert"];

export const selectShoppingListItemsSchema = createSelectSchema(shoppingListItems);
export const insertShoppingListItemsSchema = createInsertSchema(shoppingListItems);
