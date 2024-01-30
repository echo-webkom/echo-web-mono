import { relations } from "drizzle-orm";
import { pgTable, primaryKey, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { shoppingListItems, users } from ".";

export const usersToShoppingListItems = pgTable(
  "users-to-shopping-list-items",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    itemId: uuid("item")
      .notNull()
      .references(() => shoppingListItems.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    pk: primaryKey(table.userId, table.itemId),
  }),
);

export const usersToShoppingListItemsRelations = relations(usersToShoppingListItems, ({ one }) => ({
  userId: one(users, {
    fields: [usersToShoppingListItems.userId],
    references: [users.id],
  }),
  itemId: one(shoppingListItems, {
    fields: [usersToShoppingListItems.itemId],
    references: [shoppingListItems.id],
  }),
}));

export type UsersToShoppingListItems = (typeof usersToShoppingListItems)["$inferSelect"];
export type UsersToShoppingListItemsInsert = (typeof usersToShoppingListItems)["$inferInsert"];

export const selectUsersToShoppingListItemsSchema = createSelectSchema(usersToShoppingListItems);
export const insertUsersToShoppingListItemsSchema = createInsertSchema(usersToShoppingListItems);
