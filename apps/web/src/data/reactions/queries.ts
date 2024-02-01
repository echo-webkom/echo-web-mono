import { unstable_cache as cache } from "next/cache";
import { eq } from "drizzle-orm";

import { db } from "@echo-webkom/db";

import { cacheKeyFactory } from "./revalidate";

export async function getReactionByReactToKey(reactToKey: string) {
  return cache(
    async () => {
      return await db.query.reactions
        .findMany({
          where: (reaction) => eq(reaction.reactToKey, reactToKey),
        })
        .catch(() => {
          console.error("Failed to fetch reactions");
          return [];
        });
    },
    [cacheKeyFactory.reactions(reactToKey)],
    {
      tags: [cacheKeyFactory.reactions(reactToKey)],
    },
  )();
}
