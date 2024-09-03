import { and, eq } from "drizzle-orm";

import { db } from "@/db/drizzle";
import {
  shoppingListItems,
  usersToShoppingListItems,
  type ShoppingListItems,
  type ShoppingListItemsInsert,
  type UsersToShoppingListItems,
  type UsersToShoppingListItemsInsert,
} from "@/db/schemas";
import { revalidateShoppingListItems } from "./revalidations";

export const createShoppinglistItem = async (newItem: ShoppingListItemsInsert) => {
  const [insertedShoppingListItem] = await db
    .insert(shoppingListItems)
    .values(newItem)
    .returning({ id: shoppingListItems.id });
  revalidateShoppingListItems();

  return insertedShoppingListItem;
};

export const deleteShoppinglistItems = async (id: ShoppingListItems["id"]) => {
  await db.delete(shoppingListItems).where(eq(shoppingListItems.id, id));
  revalidateShoppingListItems();
};

export const addShoppinglistLike = async (newLike: UsersToShoppingListItemsInsert) => {
  await db.insert(usersToShoppingListItems).values(newLike);
  revalidateShoppingListItems();
};

export const removeShoppinglistLike = async (
  itemId: UsersToShoppingListItems["itemId"],
  userId: UsersToShoppingListItems["userId"],
) => {
  await db
    .delete(usersToShoppingListItems)
    .where(
      and(eq(usersToShoppingListItems.itemId, itemId), eq(usersToShoppingListItems.userId, userId)),
    );
  revalidateShoppingListItems();
};
