"use server";

import { auth } from "@/auth/session";
import { registerReaction } from "@/data/reactions/mutations";
import { idToEmoji } from "@/lib/emojis";

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

  const reactionId = await registerReaction({
    reactToKey: reactToKey,
    emojiId: emojiId,
    userId: user.id,
  });

  return {
    reactionId,
  };
};
