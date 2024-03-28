"use server";

import { z } from "zod";

import {
  addShoppinglistLike,
  createShoppinglistItem,
  deleteShoppinglistItems,
  removeShoppinglistLike,
} from "@/data/shopping-list-item/mutations";
import { isMemberOf } from "@/lib/memberships";
import { authedAction } from "@/lib/safe-actions";

export const hyggkomSubmit = authedAction
  .input(
    z.object({
      name: z.string(),
    }),
  )
  .create(async ({ input, ctx }) => {
    const itemId = await createShoppinglistItem({
      name: input.name,
      userId: ctx.user.id,
    });

    if (itemId) {
      await addShoppinglistLike({
        userId: ctx.user.id,
        itemId: itemId.id,
      });
    }

    return "Ditt forslag er lagt til.";
  });

export const hyggkomRemoveSubmit = authedAction.input(z.string()).create(async ({ input, ctx }) => {
  if (!isMemberOf(ctx.user, ["webkom", "hyggkom"])) {
    throw new Error("Du kan ikke fjerne forslag.");
  }

  await deleteShoppinglistItems(input);

  return "Forslaget ble fjernet.";
});

export const hyggkomLikeSubmit = authedAction.input(z.string()).create(async ({ input, ctx }) => {
  let liked = false;
  try {
    await addShoppinglistLike({
      itemId: input,
      userId: ctx.user.id,
    });
    liked = true;
  } catch {
    await removeShoppinglistLike(input, ctx.user.id);
  }

  return liked ? "Din like er blitt lagt til." : "Din like er blitt fjernet.";
});
