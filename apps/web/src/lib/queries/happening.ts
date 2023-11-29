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

export async function atMaxCapacity(id: string) {
  const max = await maxCapacityBySlug(id);
  const registrations = await db.query.registrations.findMany({
    where: (registration) => eq(registration.happeningId, id),
    with: {
      happening: true,
    },
  });
  return registrations.length >= max;
}

export async function maxCapacityBySlug(id: string) {
  return (
    await db.query.spotRanges.findMany({
      where: (spotRange) => eq(spotRange.happeningId, id),
      with: {
        event: true,
      },
    })
  ).reduce((acc, curr) => acc + curr.spots, 0);
}
