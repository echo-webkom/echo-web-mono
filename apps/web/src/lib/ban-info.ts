import { eq } from "drizzle-orm";

import { db } from "@echo-webkom/db";
import { type Happening, type User } from "@echo-webkom/db/schemas";

import { getHappeningsFromDate, getHappeningsFromDateToDate } from "@/data/happenings/queries";

export const BAN_LENGTH = 3;

export type BanInfo = {
  remainingBan: number;
  nextBedpres?: Happening;
};

async function getDateBanned(bannedFromStrike: number) {
  const dateBanned = await db.query.strikes
    .findFirst({
      where: (strike) => eq(strike.id, bannedFromStrike),
      with: {
        strikeInfo: {
          columns: {
            createdAt: true,
          },
        },
      },
    })
    .then((res) => res?.strikeInfo.createdAt ?? null);

  if (!dateBanned) {
    throw new Error("Failed to get date banned");
  }

  return dateBanned;
}

export async function getBanInfo(user: User) {
  if (!user.year) {
    throw new Error("User year not found");
  }

  if (!user.bannedFromStrike || !user.isBanned) {
    throw new Error("User is not banned");
  }

  const dateBanned = await getDateBanned(user.bannedFromStrike);

  const happeningsFromDate = await getHappeningsFromDate(dateBanned, "bedpres");

  const available = happeningsFromDate.filter((happening) =>
    happening.spotRanges.some(
      (spotRange) => user.year! >= spotRange.minYear && user.year! <= spotRange.maxYear,
    ),
  );

  const now = new Date();

  const untilNow = available.filter(
    (happening) => happening.date && new Date(happening.date) < now,
  );

  if (untilNow.length > BAN_LENGTH) {
    return {
      remainingBan: BAN_LENGTH - untilNow.length,
    } satisfies BanInfo;
  }

  const fromNow = available.filter((happening) => happening.date && new Date(happening.date) > now);

  return {
    remainingBan: BAN_LENGTH - untilNow.length,
    nextBedpres: fromNow[Math.max(0, BAN_LENGTH - untilNow.length)],
  } satisfies BanInfo;
}

export async function isUserBannedFromBedpres(user: User, bedpres: Happening) {
  if (bedpres.type !== "bedpres") {
    throw new Error("Happening is not a bedpres");
  }

  if (!bedpres.date) {
    return false;
  }

  if (!user.year) {
    throw new Error("User year not found");
  }

  if (!user.bannedFromStrike || !user.isBanned) {
    throw new Error("User is not banned");
  }

  const dateBanned = await getDateBanned(user.bannedFromStrike);

  const happenings = await getHappeningsFromDateToDate(dateBanned, bedpres.date, "bedpres");

  const available = happenings
    .filter((happening) =>
      happening.spotRanges.some(
        (spotRange) => user.year! >= spotRange.minYear && user.year! <= spotRange.maxYear,
      ),
    )
    .filter((happening) => happening !== bedpres);

  return available.length >= BAN_LENGTH ? false : true;
}
