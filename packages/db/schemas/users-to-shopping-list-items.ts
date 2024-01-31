import { relations } from "drizzle-orm";
import { pgTable, primaryKey, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { shoppingListItems, users } from ".";

export const usersToShoppingListItems = pgTable(
  "users_to_shopping_list_items",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    itemId: uuid("item_id")
      .notNull()
      .references(() => shoppingListItems.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.itemId] }),
  }),
);

export const usersToShoppingListItemsRelations = relations(usersToShoppingListItems, ({ one }) => ({
  user: one(users, {
    fields: [usersToShoppingListItems.userId],
    references: [users.id],
  }),
  item: one(shoppingListItems, {
    fields: [usersToShoppingListItems.itemId],
    references: [shoppingListItems.id],
  }),
}));

export type UsersToShoppingListItems = (typeof usersToShoppingListItems)["$inferSelect"];
export type UsersToShoppingListItemsInsert = (typeof usersToShoppingListItems)["$inferInsert"];

export const selectUsersToShoppingListItemsSchema = createSelectSchema(usersToShoppingListItems);
export const insertUsersToShoppingListItemsSchema = createInsertSchema(usersToShoppingListItems);
