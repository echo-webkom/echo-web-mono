import { eq } from "drizzle-orm";

import { db } from "@echo-webkom/db";
import { type Happening, type User } from "@echo-webkom/db/schemas";

import { getHappeningsFromDate } from "@/data/happenings/queries";

export const BAN_LENGTH = 3;

export type BanInfo = {
  remainingBan: number;
  nextBedpres?: Happening;
};

export async function getBanInfo(user: User) {
  if (!user.year) {
    throw new Error("User year not found");
  }

  if (!user.bannedFromStrike || !user.isBanned) {
    throw new Error("User is not banned");
  }

  const dateBanned = await db.query.strikes
    .findFirst({
      where: (strike) => eq(strike.id, user.bannedFromStrike!),
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
