import { and, eq } from "drizzle-orm";

import { reactions, type ReactionInsert } from "@echo-webkom/db/schemas";
import { db } from "@echo-webkom/db/serverless";

export const registerReaction = async (newReaction: Omit<ReactionInsert, "createdAt">) => {
  try {
    await db
      .insert(reactions)
      .values({
        ...newReaction,
        createdAt: new Date(),
      })
      .returning({ reactToKey: reactions.reactToKey });
  } catch {
    await db
      .delete(reactions)
      .where(
        and(
          eq(reactions.reactToKey, newReaction.reactToKey),
          eq(reactions.emojiId, newReaction.emojiId),
          eq(reactions.userId, newReaction.userId),
        ),
      );
  }
};
