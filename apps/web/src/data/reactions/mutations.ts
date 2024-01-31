import { and, eq } from "drizzle-orm";

import { db } from "@echo-webkom/db";
import { reactions, type ReactionInsert } from "@echo-webkom/db/schemas";

import { revalidateReactions } from "./revalidate";

export async function registerReaction(newReaction: Omit<ReactionInsert, "createdAt">) {
  const existingReaction = await db.query.reactions.findFirst({
    where: (reaction, { eq, and }) =>
      and(
        eq(reaction.reactToKey, newReaction.reactToKey),
        eq(reaction.emojiId, newReaction.emojiId),
        eq(reaction.userId, newReaction.userId),
      ),
  });

  if (existingReaction) {
    await db
      .delete(reactions)
      .where(
        and(
          eq(reactions.reactToKey, newReaction.reactToKey),
          eq(reactions.emojiId, newReaction.emojiId),
          eq(reactions.userId, newReaction.userId),
        ),
      );
  } else {
    const [insertedReaction] = await db
      .insert(reactions)
      .values({
        ...newReaction,
        createdAt: new Date(),
      })
      .returning({ reactToKey: reactions.reactToKey });

    if (!insertedReaction) {
      throw new Error("Reaction failed");
    }
  }

  revalidateReactions(newReaction.reactToKey);
}
