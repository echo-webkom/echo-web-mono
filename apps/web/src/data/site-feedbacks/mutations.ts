import { db } from "@echo-webkom/db";
import { siteFeedback, type SiteFeedbackInsert } from "@echo-webkom/db/schemas";

import { revalidateSiteFeedbacks } from "./revalidate";

export async function createFeedback(feedback: SiteFeedbackInsert) {
  const [insertedFeedback] = await db
    .insert(siteFeedback)
    .values(feedback)
    .returning({ id: siteFeedback.id });

  if (!insertedFeedback) {
    throw new Error("Feedback failed");
  }

  revalidateSiteFeedbacks();

  return insertedFeedback;
}
