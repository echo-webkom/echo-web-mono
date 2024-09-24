import { eq } from "drizzle-orm";

import { siteFeedback, type SiteFeedbackInsert } from "@echo-webkom/db/schemas";
import { db } from "@echo-webkom/db/serverless";

export const createFeedback = async (feedback: SiteFeedbackInsert) => {
  const [insertedFeedback] = await db
    .insert(siteFeedback)
    .values(feedback)
    .returning({ id: siteFeedback.id });
  return insertedFeedback;
};

export const updateFeedback = async (id: string, updatedFeedback: Partial<SiteFeedbackInsert>) => {
  const [updated] = await db
    .update(siteFeedback)
    .set(updatedFeedback)
    .where(eq(siteFeedback.id, id))
    .returning();
  return updated;
};
