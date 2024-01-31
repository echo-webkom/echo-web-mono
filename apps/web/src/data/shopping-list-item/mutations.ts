import { and, eq } from "drizzle-orm";

import { db } from "@echo-webkom/db";
import {
  shoppingListItems,
  usersToShoppingListItems,
  type ShoppingListItems,
  type ShoppingListItemsInsert,
  type UsersToShoppingListItems,
  type UsersToShoppingListItemsInsert,
} from "@echo-webkom/db/schemas";

import { revalidateShoppingListItems } from "./revalidations";

export async function createShoppinglistItem(newItem: ShoppingListItemsInsert) {
  await db.insert(shoppingListItems).values(newItem);
  revalidateShoppingListItems();
}

export async function deleteShoppinglistItems(id: ShoppingListItems["id"]) {
  await db.delete(shoppingListItems).where(eq(shoppingListItems.id, id));
  revalidateShoppingListItems();
}

export async function addShoppinglistLike(newLike: UsersToShoppingListItemsInsert) {
  await db.insert(usersToShoppingListItems).values(newLike);
  revalidateShoppingListItems();
}

export async function removeShoppinglistLike(
  itemId: UsersToShoppingListItems["itemId"],
  userId: UsersToShoppingListItems["userId"],
) {
  await db
    .delete(usersToShoppingListItems)
    .where(
      and(eq(usersToShoppingListItems.itemId, itemId), eq(usersToShoppingListItems.userId, userId)),
    );
  revalidateShoppingListItems();
}
