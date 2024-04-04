import { and, asc, eq, gt, lt } from "drizzle-orm";

import { db } from "@echo-webkom/db";
import { type Happening, type HappeningType } from "@echo-webkom/db/schemas";

export async function getFullHappening(slug: Happening["slug"]) {
  return await db.query.happenings.findFirst({
    where: (happening) => eq(happening.slug, slug),
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
