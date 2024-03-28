"use server";

import { z } from "zod";

import { registerReaction } from "@/data/reactions/mutations";
import { idToEmoji } from "@/lib/emojis";
import { authedAction } from "@/lib/safe-actions";

export const handleReact = authedAction
  .input(
    z.object({
      reactToKey: z.string(),
      emojiId: z.number(),
    }),
  )
  .create(async ({ input, ctx }) => {
    if (input.emojiId < 0 || input.emojiId >= Object.keys(idToEmoji).length) {
      throw new Error("Ugylig emoji");
    }

    const reactionId = await registerReaction({
      reactToKey: input.reactToKey,
      emojiId: input.emojiId,
      userId: ctx.user.id,
    });

    return {
      reactionId,
    };
  });
