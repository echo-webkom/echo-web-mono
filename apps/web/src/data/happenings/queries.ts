import { and, asc, eq, gt, lt } from "drizzle-orm";
import { log } from "next-axiom";

import { db } from "@echo-webkom/db";
import { type Happening, type HappeningType } from "@echo-webkom/db/schemas";

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
  return await db.query.happenings
    .findFirst({
      where: (happening) => eq(happening.id, happeningId),
      with: {
        registrations: true,
        spotRanges: true,
      },
    })
    .then((result) => {
      return {
        registrations: result?.registrations ?? [],
        spotRanges: result?.spotRanges ?? [],
      };
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
