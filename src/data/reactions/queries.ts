import { unstable_cache as cache } from "next/cache";
import { eq } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { cacheKeyFactory } from "./revalidate";

export const getReactionByReactToKey = async (reactToKey: string) => {
  return cache(
    async () => {
      return await db.query.reactions
        .findMany({
          where: (reaction) => eq(reaction.reactToKey, reactToKey),
        })
        .catch(() => {
          console.error("Failed to fetch reactions", {
            reactToKey,
          });

          return [];
        });
    },
    [cacheKeyFactory.reactions(reactToKey)],
    {
      tags: [cacheKeyFactory.reactions(reactToKey)],
    },
  )();
};
