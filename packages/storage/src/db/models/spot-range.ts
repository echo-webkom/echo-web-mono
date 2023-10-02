import { and, eq, sql } from "drizzle-orm";

import { db } from "../drizzle";
import { registrations } from "../schemas";

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
