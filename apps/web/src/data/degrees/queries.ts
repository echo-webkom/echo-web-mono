import { unstable_cache as cache } from "next/cache";

import { db } from "@echo-webkom/db";

import { cacheKeyFactory } from "./revalidate";

export function getAllDegrees() {
  return cache(
    async () => {
      return await db.query.degrees.findMany({
        orderBy: (degree, { asc }) => [asc(degree.name)],
      });
    },
    [cacheKeyFactory.degrees],
    {
      tags: [cacheKeyFactory.degrees],
    },
  )();
}
