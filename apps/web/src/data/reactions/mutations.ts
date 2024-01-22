import { db } from "@echo-webkom/db";
import { reactions, type ReactionInsert } from "@echo-webkom/db/schemas";

import { revalidateReactions } from "./revalidate";

export async function registerReaction(newReaction: Omit<ReactionInsert, "createdAt">) {
  const [insertedReaction] = await db
    .insert(reactions)
    .values({
      ...newReaction,
      createdAt: new Date(),
    })
    .returning({ reactionsId: reactions.reactionId });

  if (!insertedReaction) {
    throw new Error("Reaction failed");
  }

  revalidateReactions(newReaction.reactionId);
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
