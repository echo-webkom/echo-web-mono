import { unstable_cache as cache } from "next/cache";

import { db } from "@/db/drizzle";
import { cacheKeyFactory } from "./revalidate";

export const getAllFeedback = async () => {
  return await cache(
    async () => {
      return await db.query.siteFeedback.findMany({
        orderBy: (feedback, { desc }) => [desc(feedback.createdAt)],
      });
    },
    [cacheKeyFactory.siteFeedbacks],
    {
      tags: [cacheKeyFactory.siteFeedbacks],
    },
  )();
};

export const getFeedbackById = async (id: string) => {
  return await db.query.siteFeedback.findFirst({
    where: (feedback, { eq }) => eq(feedback.id, id),
  });
};
