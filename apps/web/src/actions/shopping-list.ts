"use server";

import { z } from "zod";

import { auth } from "@echo-webkom/auth";

import {
  addShoppinglistLike,
  createShoppinglistItem,
  deleteShoppinglistItems,
  removeShoppinglistLike,
} from "@/data/shopping-list-item/mutations";
import { isMemberOf } from "@/lib/memberships";

const shoppingListSchema = z.object({
  name: z.string(),
});

export async function hyggkomSubmit(payload: z.infer<typeof shoppingListSchema>) {
  try {
    const user = await auth();

    const data = await shoppingListSchema.parseAsync(payload);

    if (!user) {
      return {
        success: false,
        message: "Du er ikke logget inn",
      };
    }
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
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Skjemaet er ikke i riktig format",
      };
    }
    return {
      success: false,
      message: "Noe gikk galt",
    };
  }
}

export async function hyggkomRemoveSubmit(id: string) {
  const user = await auth();
  const isAdmin = (user && isMemberOf(user, ["webkom", "hyggkom"])) ?? false;

  if (!isAdmin) {
    return {
      success: false,
      message: "Du kan ikke fjerne forslag.",
    };
  }
  await deleteShoppinglistItems(id);
  return {
    success: true,
    message: "Forslaget ble fjernet.",
  };
}

export async function hyggkomLikeSubmit(itemId: string) {
  const user = await auth();

  if (!user) {
    return {
      success: false,
      message: "Du er ikke logget inn.",
    };
  }

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
}
