import { unstable_cache as cache } from "next/cache";
import { eq } from "drizzle-orm";

import { db } from "@echo-webkom/db";

import { cacheKeyFactory } from "./cache-keys";

export async function getRegistrationsByHappeningId(happeningId: string) {
  return cache(
    async () => {
      return await db.query.registrations
        .findMany({
          where: (registration) => eq(registration.happeningId, happeningId),
          with: {
            user: true,
          },
        })
        .catch(() => []);
    },
    [cacheKeyFactory.registrations(happeningId)],
    {
      tags: [cacheKeyFactory.registrations(happeningId)],
    },
  )();
}

export async function getSpotRangeByHappeningId(happeningId: string) {
  return cache(
    async () => {
      return await db.query.spotRanges
        .findMany({
          where: (spotRange) => eq(spotRange.happeningId, happeningId),
        })
        .catch(() => []);
    },
    [cacheKeyFactory.spots],
    {
      tags: [cacheKeyFactory.spots],
    },
  )();
}
