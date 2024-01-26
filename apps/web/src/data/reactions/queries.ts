import { unstable_cache as cache } from "next/cache";
import { eq } from "drizzle-orm";

import { db } from "@echo-webkom/db";

import { cacheKeyFactory } from "./revalidate";

export async function getReactionByHappeningId(happeningId: string) {
  return cache(
    async () => {
      return await db.query.reactions
        .findMany({
          where: (reaction) => eq(reaction.happeningId, happeningId),
        })
        .catch(() => []);
    },
    [cacheKeyFactory.reactions(happeningId)],
    {
      tags: [cacheKeyFactory.reactions(happeningId)],
    },
  )();
}
