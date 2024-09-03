import { and, eq } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { reactions, type ReactionInsert } from "@/db/schemas";
import { revalidateReactions } from "./revalidate";

export const registerReaction = async (newReaction: Omit<ReactionInsert, "createdAt">) => {
  try {
    await db
      .insert(reactions)
      .values({
        ...newReaction,
        createdAt: new Date(),
      })
      .returning({ reactToKey: reactions.reactToKey });
  } catch (error) {
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

  revalidateReactions(newReaction.reactToKey);
};
