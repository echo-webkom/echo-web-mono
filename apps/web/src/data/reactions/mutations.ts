import { and, eq } from "drizzle-orm";

import { db } from "@echo-webkom/db";
import { reactions, type ReactionInsert } from "@echo-webkom/db/schemas";

import { revalidateReactions } from "./revalidate";

export async function registerReaction(newReaction: Omit<ReactionInsert, "createdAt">) {
  const existingReaction = await db.query.reactions.findFirst({
    where: (reaction, { eq, and }) =>
      and(
        eq(reaction.happeningId, newReaction.happeningId),
        eq(reaction.emojiId, newReaction.emojiId),
        eq(reaction.userId, newReaction.userId),
      ),
  });

  if (existingReaction) {
    await db
      .delete(reactions)
      .where(
        and(
          eq(reactions.happeningId, newReaction.happeningId),
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
      .returning({ happeningId: reactions.happeningId });

    if (!insertedReaction) {
      throw new Error("Reaction failed");
    }
  }

  revalidateReactions(newReaction.happeningId);
}

/* export async function createRegistration(newRegistrations: Omit<RegistrationInsert, "createdAt">) {
  const [insertedRegistration] = await db
    .insert(registrations)
    .values({
      ...newRegistrations,
      createdAt: new Date(),
    })
    .returning({ userId: registrations.userId, happeningId: registrations.happeningId});

  if (!insertedRegistration) {
    throw new Error("Registration failed");
  }

  revalidateReactions(newRegistrations.happeningId);

  return insertedRegistration;
} */
