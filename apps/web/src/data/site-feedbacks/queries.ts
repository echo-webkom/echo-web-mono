import { unstable_cache as cache } from "next/cache";

import { db } from "@echo-webkom/db";

import { cacheKeyFactory } from "./revalidate";

export async function getAllFeedback() {
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
}
