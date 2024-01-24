import { unstable_cache as cache } from "next/cache";
import { eq } from "drizzle-orm";

import { db } from "@echo-webkom/db";

import { cacheKeyFactory } from "./cache-keys";

export async function getSpotRangeByHappeningId(happeningId: string) {
  return cache(
    async () => {
      return await db.query.spotRanges
        .findMany({
          where: (spotRange) => eq(spotRange.happeningId, happeningId),
        })
        .catch(() => []);
    },
    [cacheKeyFactory.happeningSpotrange(happeningId)],
    {
      tags: [cacheKeyFactory.happeningSpotrange(happeningId)],
    },
  )();
}
