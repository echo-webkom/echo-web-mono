"use server";

import { z } from "zod";

import {
  addShoppinglistLike,
  createShoppinglistItem,
  deleteShoppinglistItems,
  removeShoppinglistLike,
} from "@/data/shopping-list-item/mutations";
import { authActionClient, groupActionClient } from "@/lib/safe-action";

const shoppingListSchema = z.object({
  name: z.string(),
});

export const hyggkomSubmitAction = authActionClient
  .metadata({ actionName: "hyggkomSubmit" })
  .schema(shoppingListSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { user } = ctx;
    const data = parsedInput;

    const itemId = await createShoppinglistItem({
      name: data.name,
      userId: user.id,
    });

    if (itemId) {
      await addShoppinglistLike({
        userId: user.id,
        itemId: itemId.id,
      });
    }

    return {
      success: true,
      message: "Ditt forslag er lagt til.",
    };
  });

export const hyggkomRemoveAction = groupActionClient(["webkom", "hyggkom", "hovedstyret"])
  .metadata({ actionName: "hyggkomRemove" })
  .schema(z.string())
  .action(async ({ parsedInput }) => {
    await deleteShoppinglistItems(parsedInput);
    return {
      success: true,
      message: "Forslaget ble fjernet.",
    };
  });

export const hyggkomLikeAction = authActionClient
  .metadata({ actionName: "hyggkomLike" })
  .schema(z.string())
  .action(async ({ parsedInput, ctx }) => {
    const itemId = parsedInput;
    const { user } = ctx;

    try {
      await addShoppinglistLike({
        itemId: itemId,
        userId: user.id,
      });

      return {
        success: true,
        message: "Forslaget ble liket.",
      };
    } catch {
      await removeShoppinglistLike(itemId, user.id);
    }
    return {
      success: true,
      message: "Din like er blitt fjernet.",
    };
  });
