import { unstable_cache as cache } from "next/cache";

import { db } from "@echo-webkom/db";

import { cacheKeyFactory } from "../fag-vurdering/revalidate";

export function getAllSubjectReviews() {
  return cache(
    async () => {
      return await db.query.subjectReviews
        .findMany({
          with: { subjectCode: true },
        })
        .catch(() => []);
    },
    [cacheKeyFactory.subjectReviews()],
    {
      tags: [cacheKeyFactory.subjectReviews()],
    },
  )();
}
