import { relations, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { nanoid } from "nanoid";

import { users } from ".";
import { usersToShoppingListItems } from "./users-to-shopping-list-items";

export const shoppingListItems = sqliteTable("shopping_list_item", {
  id: text("id").primaryKey().$defaultFn(nanoid),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
  name: text("name").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const shoppingListItemsRelations = relations(shoppingListItems, ({ one, many }) => ({
  user: one(users, {
    fields: [shoppingListItems.userId],
    references: [users.id],
  }),
  likes: many(usersToShoppingListItems),
}));

export type ShoppingListItems = InferSelectModel<typeof shoppingListItems>;
export type ShoppingListItemsInsert = InferInsertModel<typeof shoppingListItems>;

export const selectShoppingListItemsSchema = createSelectSchema(shoppingListItems);
export const insertShoppingListItemsSchema = createInsertSchema(shoppingListItems);
