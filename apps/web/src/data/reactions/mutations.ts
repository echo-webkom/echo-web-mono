import { and, eq } from "drizzle-orm";

import { db } from "@echo-webkom/db";
import { reactions, type ReactionInsert } from "@echo-webkom/db/schemas";

import { revalidateReactions } from "./revalidate";

export async function registerReaction(newReaction: Omit<ReactionInsert, "createdAt">) {
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
}
