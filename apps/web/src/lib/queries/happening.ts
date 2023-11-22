import { eq } from "drizzle-orm";

import { db } from "@echo-webkom/db";
import { type Happening } from "@echo-webkom/db/schemas";

export async function getHappeningBySlug(slug: Happening["slug"]) {
  return await db.query.happenings.findFirst({
    where: (happening) => eq(happening.slug, slug),
    with: {
      questions: true,
    },
  });
}

export async function atMaxCapacity(slug: string) {
  const max = await maxCapacityBySlug(slug);
  const registrations = await db.query.registrations.findMany({
    where: (registration) => eq(registration.happeningSlug, slug),
    with: {
      happening: true,
    },
  });
  return registrations.length >= max;
}

export async function maxCapacityBySlug(slug?: string) {
  if (!slug) {
    throw new Error("Must provide slug");
  }
  return (
    await db.query.spotRanges.findMany({
      where: (spotRange) => eq(spotRange.happeningSlug, slug),
      with: {
        event: true,
      },
    })
  ).reduce((acc, curr) => acc + curr.spots, 0);
}
