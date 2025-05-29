import { relations, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { pgTable, primaryKey, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { shoppingListItems, users } from ".";

export const usersToShoppingListItems = pgTable(
  "users_to_shopping_list_items",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    itemId: uuid("item_id")
      .notNull()
      .references(() => shoppingListItems.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.itemId] })],
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

export type UsersToShoppingListItems = InferSelectModel<typeof usersToShoppingListItems>;
export type UsersToShoppingListItemsInsert = InferInsertModel<typeof usersToShoppingListItems>;

export const selectUsersToShoppingListItemsSchema = createSelectSchema(usersToShoppingListItems);
export const insertUsersToShoppingListItemsSchema = createInsertSchema(usersToShoppingListItems);
