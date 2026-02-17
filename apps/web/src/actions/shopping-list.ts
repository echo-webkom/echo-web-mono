"use server";

import { z } from "zod";

import { auth } from "@/auth/session";
import { isMemberOf } from "@/lib/memberships";
import { unoWithAdmin } from "../api/server";

const shoppingListSchema = z.object({
  name: z.string(),
});

export const hyggkomSubmit = async (payload: z.infer<typeof shoppingListSchema>) => {
  try {
    const user = await auth();

    const data = await shoppingListSchema.parseAsync(payload);

    if (!user) {
      return {
        success: false,
        message: "Du er ikke logget inn",
      };
    }

    // Creates item and likes it for the creator.
    await unoWithAdmin.shopping.createItem({
      name: data.name,
      userId: user.id,
    });

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
};

export const hyggkomRemoveSubmit = async (id: string) => {
  const user = await auth();
  const isAdmin = (user && isMemberOf(user, ["webkom", "hyggkom"])) ?? false;

  if (!isAdmin) {
    return {
      success: false,
      message: "Du kan ikke fjerne forslag.",
    };
  }

  await unoWithAdmin.shopping.removeItem(id);

  return {
    success: true,
    message: "Forslaget ble fjernet.",
  };
};

export const hyggkomLikeSubmit = async (itemId: string) => {
  const user = await auth();

  if (!user) {
    return {
      success: false,
      message: "Du er ikke logget inn.",
    };
  }

  await unoWithAdmin.shopping.toggleLike({
    itemId: itemId,
    userId: user.id,
  });

  return {
    success: true,
    message: "Suksess",
  };
};
