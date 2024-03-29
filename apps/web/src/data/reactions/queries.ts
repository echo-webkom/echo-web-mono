import { unstable_cache as cache } from "next/cache";
import { eq } from "drizzle-orm";

import { db } from "@echo-webkom/db";

import { Logger } from "@/lib/logger";
import { cacheKeyFactory } from "./revalidate";

export async function getReactionByReactToKey(reactToKey: string) {
  return cache(
    async () => {
      return await db.query.reactions
        .findMany({
          where: (reaction) => eq(reaction.reactToKey, reactToKey),
        })
        .catch(() => {
          Logger.error(
            getReactionByReactToKey.name,
            `Failed to fetch reactions for reactToKey: ${reactToKey}`,
          );

          return [];
        });
    },
    [cacheKeyFactory.reactions(reactToKey)],
    {
      tags: [cacheKeyFactory.reactions(reactToKey)],
    },
  )();
}
