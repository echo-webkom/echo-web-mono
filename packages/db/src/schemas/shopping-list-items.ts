import { relations, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { users } from ".";
import { usersToShoppingListItems } from "./users-to-shopping-list-items";

export const shoppingListItems = pgTable("shopping_list_item", {
  id: uuid().defaultRandom().primaryKey(),
  userId: text()
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
  name: text().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
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
