"use server";

import { auth } from "@echo-webkom/auth";
import { db } from "@echo-webkom/db";
import { usersToShoppingListItems } from "@echo-webkom/db/schemas";
import { and, eq } from "drizzle-orm";

export async function hyggkomLikeSubmit(payload: string) {
  const user = await auth();

  if (!user) {
    return {
      success: false,
      message: "Du er ikke logget inn.",
    };
  }

  try {
        await db.insert(usersToShoppingListItems).values([
            {userId: user.id,
            itemId: payload},
        ]);
        return {
          success: true,
          message: "Forslaget ble liket."
        };
      } catch {
          await db.delete(usersToShoppingListItems)
          .where(and (eq (usersToShoppingListItems.itemId, payload), eq (usersToShoppingListItems.userId, user.id)));
          }
          return {
            success: true,
            message: "Din like er blitt fjernet."
          };
      }
