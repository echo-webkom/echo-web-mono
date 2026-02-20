"use server";

import { auth } from "@/auth/session";
import { idToEmoji } from "@/lib/emojis";
import { unoWithAdmin } from "../api/server";

export const handleReact = async (reactToKey: string, emojiId: number) => {
  const user = await auth();

  if (!user) {
    return {
      status: 401,
      message: "Unauthorized",
    };
  }

  if (emojiId < 0 || emojiId > Object.keys(idToEmoji).length) {
    return {
      status: 400,
      message: "Invalid emojiId",
    };
  }

  const newReactions = await unoWithAdmin.reactions.toggle(reactToKey, {
    emojiId: emojiId,
    userId: user.id,
  });

  return newReactions;
};
