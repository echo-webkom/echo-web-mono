import { and, asc, eq, gt } from "drizzle-orm";

import { db } from "@echo-webkom/db";
import { type User } from "@echo-webkom/db/schemas";

// Returns how many more bedpres the user is banned from
export async function remainingBanNumber({ year, isBanned, bannedFromStrike }: User) {
  const BAN_LENGTH = 3;

  if (!isBanned || !bannedFromStrike) {
    throw new Error("User is not banned");
  }

  if (!year) {
    throw new Error("User year not found");
  }

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
    .then((res) => (res?.strikeInfo ? res.strikeInfo.createdAt : undefined));

  if (!dateBanned) {
    throw new Error("Failed to get date banned");
  }

  const upcoming = await db.query.happenings.findMany({
    where: (happening) => and(eq(happening.type, "bedpres"), gt(happening.date, dateBanned)),
    with: {
      spotRanges: true,
    },
    orderBy: (happening) => [asc(happening.date)],
  });

  const availableUpcoming = upcoming.filter((bedpres) =>
    bedpres.spotRanges.some((spotRange) => year >= spotRange.minYear && year <= spotRange.maxYear),
  );

  const remainingBan: number =
    availableUpcoming.length < BAN_LENGTH + 1
      ? BAN_LENGTH - availableUpcoming.length
      : BAN_LENGTH -
        availableUpcoming.filter((bedpres) => bedpres.date && bedpres.date < new Date()).length;

  const nextBedpres: { slug: string; title: string } | undefined = availableUpcoming[BAN_LENGTH];

  return { remainingBan, nextBedpres };
}
