"use server";

import { z } from "zod";

import { registerReaction } from "@/data/reactions/mutations";
import { idToEmoji } from "@/lib/emojis";
import { authActionClient } from "@/lib/safe-action";

export const reactAction = authActionClient
  .metadata({ actionName: "react" })
  .schema(z.object({ reactToKey: z.string(), emojiId: z.number() }))
  .action(async ({ parsedInput, ctx }) => {
    const { reactToKey, emojiId } = parsedInput;
    const { user } = ctx;

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
  });
