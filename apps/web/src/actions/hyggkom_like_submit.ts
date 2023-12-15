"use server";

import { getAuth } from "@echo-webkom/auth";
import { db } from "@echo-webkom/db";
import { usersToShoppingListItems } from "@echo-webkom/db/schemas";
import { and, eq } from "drizzle-orm";

export async function hyggkomLikeSubmit(payload: string) {
  const user = await getAuth();

  if (!user) {
    return {
      success: false,
      message: "Du er ikke logget inn",
    };
  }

  try {
        await db.insert(usersToShoppingListItems).values([
            {userId: user.id,
            itemId: payload},
        ]);
        return true;
      } catch {
          await db.delete(usersToShoppingListItems)
          .where(and (eq (usersToShoppingListItems.itemId, payload), eq (usersToShoppingListItems.userId, user.id)));
          }
          return false;
      }
