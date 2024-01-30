"use server";

import { eq } from "drizzle-orm";

import { db } from "@echo-webkom/db";
import { shoppingListItems, usersToShoppingListItems } from "@echo-webkom/db/schemas";

export async function hyggkomRemoveSubmit(payload: string) {
  await db.delete(usersToShoppingListItems).where(eq(usersToShoppingListItems.itemId, payload));
  await db.delete(shoppingListItems).where(eq(shoppingListItems.id, payload));
  return {
    success: true,
    message: "Forslaget ble fjernet.",
  };
}
