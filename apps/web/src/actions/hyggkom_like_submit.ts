"use server";

import { getAuth } from "@echo-webkom/auth";
import { db } from "@echo-webkom/db";
import { usersToShoppingListItems } from "@echo-webkom/db/schemas/users_to_shopping_list_items";

export async function hyggkomLikeSubmit(payload: string) {
    try {
        const user = await getAuth();

        if (!user) {
            return {
              success: false,
              message: "Du er ikke logget inn",
            };
        }
        await db.insert(usersToShoppingListItems).values([
            {userId: user.id,
            itemId: payload},
        ]);
        return {
            success: true,
            message: "Innlegget ble liket.",
          };

    } catch (error)
    {return {
          success: false,
          message: "Noe gikk galt",
        };
      }
    };
