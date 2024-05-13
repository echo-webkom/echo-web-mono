"use server";

import { registerReaction } from "@/data/reactions/mutations";
import { idToEmoji } from "@/lib/emojis";
import { getUser } from "@/lib/get-user";

export async function handleReact(reactToKey: string, emojiId: number) {
  const user = await getUser();

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
}
