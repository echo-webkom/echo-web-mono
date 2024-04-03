import { unstable_cache as cache } from "next/cache";
import { eq } from "drizzle-orm";

import { db } from "@echo-webkom/db";

import { Logger } from "@/lib/logger";
import { cacheKeyFactory } from "./revalidate";

export async function getSpotRangeByHappeningId(happeningId: string) {
  return cache(
    async () => {
      return await db.query.spotRanges
        .findMany({
          where: (spotRange) => eq(spotRange.happeningId, happeningId),
        })
        .catch(() => {
          Logger.error(
            getSpotRangeByHappeningId.name,
            `Failed to fetch spot range for happening with ID: ${happeningId}`,
          );

          return [];
        });
    },
    [cacheKeyFactory.happeningSpotrange(happeningId)],
    {
      tags: [cacheKeyFactory.happeningSpotrange(happeningId)],
    },
  )();
}
