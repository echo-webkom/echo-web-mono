import { eq } from "drizzle-orm";

import { db } from "@echo-webkom/db";
import { siteFeedback, type SiteFeedbackInsert } from "@echo-webkom/db/schemas";

import { revalidateSiteFeedbacks } from "./revalidate";

export const createFeedback = async (feedback: SiteFeedbackInsert) => {
  const [insertedFeedback] = await db
    .insert(siteFeedback)
    .values(feedback)
    .returning({ id: siteFeedback.id });

  if (!insertedFeedback) {
    throw new Error("Feedback failed");
  }

  revalidateSiteFeedbacks();

  return insertedFeedback;
};

export const updateFeedback = async (id: string, updatedFeedback: Partial<SiteFeedbackInsert>) => {
  const [updated] = await db
    .update(siteFeedback)
    .set(updatedFeedback)
    .where(eq(siteFeedback.id, id))
    .returning();

  if (!updated) {
    throw new Error("Feedback update failed");
  }

  revalidateSiteFeedbacks();

  return updated;
};
