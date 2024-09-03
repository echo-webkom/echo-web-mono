import { and, asc, eq, gt, lt } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { type Happening, type HappeningType } from "@/db/schemas";
import { isErrorMessage } from "@/utils/error";

export const getFullHappening = async (slug: Happening["slug"]) => {
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
};

export const getFullHappenings = async () => {
  return await db.query.happenings.findMany({
    with: {
      questions: true,
      registrations: true,
      spotRanges: true,
      groups: true,
    },
  });
};

export const getHappeningBySlug = async (slug: Happening["slug"]) => {
  return await db.query.happenings.findFirst({
    where: (happening) => eq(happening.slug, slug),
    with: {
      questions: true,
    },
  });
};

export const getHappeningById = async (id: string) => {
  return await db.query.happenings
    .findFirst({
      where: (happening) => eq(happening.id, id),
      with: {
        questions: true,
        groups: true,
      },
    })
    .catch((error) => {
      console.error("Failed to fetch happening", {
        id,
        error: isErrorMessage(error) ? error.message : "Unknown error",
      });

      return null;
    });
};

export const getHappeningSpotRangeAndRegistrations = async (happeningId: string) => {
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
};

export const getHappeningsFromDate = async (date: Date, type: HappeningType) => {
  return await db.query.happenings.findMany({
    where: (happening) => and(eq(happening.type, type), gt(happening.date, date)),
    with: {
      spotRanges: true,
    },
    orderBy: (happening) => [asc(happening.date)],
  });
};

export const getHappeningsFromDateToDate = async (
  fromDate: Date,
  toDate: Date,
  type: HappeningType,
) => {
  return await db.query.happenings.findMany({
    where: (happening) =>
      and(eq(happening.type, type), gt(happening.date, fromDate), lt(happening.date, toDate)),
    with: {
      spotRanges: true,
    },
    orderBy: (happening) => [asc(happening.date)],
  });
};
