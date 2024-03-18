import { unstable_cache as cache } from "next/cache";
import { and, asc, desc, eq, gt, lt } from "drizzle-orm";

import { db } from "@echo-webkom/db";
import { type Happening, type HappeningType } from "@echo-webkom/db/schemas";

export async function getHappeningCsvData(happeningId: string) {
  return await db.query.happenings.findFirst({
    where: (happening, { eq }) => eq(happening.id, happeningId),
    with: {
      registrations: {
        with: {
          answers: true,
          user: true,
        },
      },
      questions: true,
      groups: true,
    },
  });
}

export async function getHappeningBySlug(slug: Happening["slug"]) {
  return await db.query.happenings.findFirst({
    where: (happening) => eq(happening.slug, slug),
    with: {
      questions: true,
    },
  });
}

export async function getPastHappenings(n: number, type: HappeningType) {
  return await cache(
    async () => {
      return await db.query.happenings.findMany({
        where: (happening) => and(lt(happening.date, new Date()), eq(happening.type, type)),
        orderBy: (happening) => [desc(happening.date)],
        limit: n,
      });
    },
    ["pastHappenings"],
    {
      revalidate: 60,
    },
  )();
}

export async function getHappeningsFromDate(date: Date, type: HappeningType) {
  return await db.query.happenings.findMany({
    where: (happening) => and(eq(happening.type, type), gt(happening.date, date)),
    with: {
      spotRanges: true,
    },
    orderBy: (happening) => [asc(happening.date)],
  });
}

export async function getHappeningsFromDateToDate(
  fromDate: Date,
  toDate: Date,
  type: HappeningType,
) {
  return await db.query.happenings.findMany({
    where: (happening) =>
      and(eq(happening.type, type), gt(happening.date, fromDate), lt(happening.date, toDate)),
    with: {
      spotRanges: true,
    },
    orderBy: (happening) => [asc(happening.date)],
  });
}
