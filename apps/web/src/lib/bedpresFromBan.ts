import { eq } from "drizzle-orm";

import { db } from "@echo-webkom/db";
import { type User } from "@echo-webkom/db/schemas";

import { getHappeningsFromDate } from "@/data/happenings/queries";

// Returns all available bedpresses from date of ban
export async function getBedpresFromBan({ year, bannedFromStrike }: User) {
  if (!year) {
    throw new Error("User year not found");
  }

  if (!bannedFromStrike) {
    throw new Error("User is not banned");
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

  return await getHappeningsFromDate(dateBanned, "bedpres");
}
