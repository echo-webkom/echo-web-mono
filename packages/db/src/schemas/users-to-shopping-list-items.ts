import { relations, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { shoppingListItems, users } from ".";

export const usersToShoppingListItems = sqliteTable(
  "users_to_shopping_list_items",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    itemId: text("item_id")
      .notNull()
      .references(() => shoppingListItems.id, { onDelete: "cascade" }),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
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

export type UsersToShoppingListItems = InferSelectModel<typeof usersToShoppingListItems>;
export type UsersToShoppingListItemsInsert = InferInsertModel<typeof usersToShoppingListItems>;

export const selectUsersToShoppingListItemsSchema = createSelectSchema(usersToShoppingListItems);
export const insertUsersToShoppingListItemsSchema = createInsertSchema(usersToShoppingListItems);
