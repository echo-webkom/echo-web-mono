import { unstable_cache as cache } from "next/cache";

import { db } from "@echo-webkom/db";

import { cacheKeyFactory } from "./revalidate";

export async function getSpotRangeByHappeningId(happeningId: string) {
  return cache(
    async () => {
      return await db.query.spotRanges
        .findMany({
          where: (spotRange, { eq }) => eq(spotRange.happeningId, happeningId),
        })
        .catch(() => {
          console.error("Failed to fetch spot range", {
            happeningId,
          });

          return [];
        });
    },
    [cacheKeyFactory.happeningSpotrange(happeningId)],
    {
      tags: [cacheKeyFactory.happeningSpotrange(happeningId)],
    },
  )();
}
