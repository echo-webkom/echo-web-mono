import { relations, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { users } from ".";
import { usersToShoppingListItems } from "./users-to-shopping-list-items";

export const shoppingListItems = pgTable("shopping_list_item", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
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
