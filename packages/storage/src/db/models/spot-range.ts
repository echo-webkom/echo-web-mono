import { and, eq, sql } from "drizzle-orm";

import { db } from "../drizzle";
import { registrations } from "../schemas";

export const getSpotRangeByHappening = async (slug: string) => {
  const spotRanges = await db.query.spotRanges.findMany({
    where: (sr) => eq(sr.happeningSlug, slug),
  });

  const formattedSpotRanges = spotRanges.map(async (sr) => {
    const spotRangeRegistrations = await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(registrations)
      .where(and(eq(registrations.spotRangeId, sr.id)));

    return {
      spots: sr.spots,
      registrations: Number(spotRangeRegistrations[0]!.count),
      minYear: sr.minYear,
      maxYear: sr.maxYear,
    };
  });

  return await Promise.all(formattedSpotRanges);
};
