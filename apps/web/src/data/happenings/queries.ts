import { and, asc, eq, gt, lt } from "drizzle-orm";
import { log } from "next-axiom";

import { db } from "@echo-webkom/db";
import {
  happenings,
  registrations,
  spotRanges,
  type Happening,
  type HappeningType,
  type Registration,
  type SpotRange,
} from "@echo-webkom/db/schemas";

import { isErrorMessage } from "@/utils/error";

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

export async function getHappeningById(id: string) {
  return await db.query.happenings
    .findFirst({
      where: (happening) => eq(happening.id, id),
      with: {
        questions: true,
        groups: true,
      },
    })
    .catch((error) => {
      log.error("Failed to fetch happening", {
        id,
        error: isErrorMessage(error) ? error.message : "Unknown error",
      });

      return null;
    });
}

export async function getHappeningSpotRangeAndRegistrations(happeningId: string) {
  const result = await db
    .select()
    .from(happenings)
    .leftJoin(spotRanges, eq(spotRanges.happeningId, happeningId))
    .leftJoin(registrations, eq(registrations.happeningId, happeningId))
    .where(eq(happenings.id, happeningId));

  return result.reduce(
    (acc, curr) => {
      if (curr.spot_range) {
        acc.spotRanges.push(curr.spot_range);
      }

      if (curr.registration) {
        acc.registrations.push(curr.registration);
      }

      return acc;
    },
    {
      spotRanges: [],
      registrations: [],
    } as {
      spotRanges: Array<SpotRange>;
      registrations: Array<Registration>;
    },
  );
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
