import { eq } from "drizzle-orm";

import { db } from "../drizzle";

export const getSpotRangeByHappening = async (slug: string) => {
  const spotRanges = await db.query.spotRanges.findMany({
    where: (sr) => eq(sr.happeningSlug, slug),
  });

  const formattedSpotRanges = spotRanges.map((sr) => {
    return {
      spots: sr.spots,
      minYear: sr.minYear,
      maxYear: sr.maxYear,
    };
  });

  return await Promise.all(formattedSpotRanges);
};
