import { eq } from "drizzle-orm";

import { db } from "@echo-webkom/db";
import {
  strikeInfos,
  strikes,
  users,
  type StrikeInfoInsert,
  type StrikeInsert,
} from "@echo-webkom/db/schemas";

import { revalidateStrikes } from "./revalidate";

export async function createStrikes(
  data: StrikeInfoInsert,
  userId: string,
  amount: number,
  bannableStrikeNumber?: number,
) {
  await db.transaction(async (tx) => {
    const info = await tx
      .insert(strikeInfos)
      .values(data)
      .returning({ id: strikeInfos.id })
      .then((res) => res[0] ?? null);

    if (!info) {
      throw new Error("StrikeInfoInsert failed");
    }

    const issuedStrikes = await tx
      .insert(strikes)
      .values(
        Array.from({ length: amount }).map(
          () =>
            ({
              strikeInfoId: info.id,
              userId: userId,
            }) satisfies StrikeInsert,
        ),
      )
      .returning({ id: strikes.id });

    if (!issuedStrikes) {
      throw new Error("StikeInsert failed");
    }

    if (issuedStrikes.length !== amount) {
      throw new Error("Failed to insert all strikes");
    }

    if (bannableStrikeNumber) {
      const bannableStrike = issuedStrikes.at(bannableStrikeNumber - 1);

      if (!bannableStrike) {
        throw new Error("Failed to get bannable strike");
      }

      const banUser = await tx
        .update(users)
        .set({ bannedFromStrike: bannableStrike.id, isBanned: true })
        .where(eq(users.id, userId))
        .returning({ id: users.id });

      if (!banUser) {
        throw new Error("Failed to ban user");
      }
    }
  });

  revalidateStrikes(userId);
}

export async function deleteStrike(userId: string, strikeId: number) {
  const strike = await db
    .update(strikes)
    .set({ isDeleted: true })
    .where(eq(strikes.id, strikeId))
    .returning({ id: strikes.id })
    .then((res) => res[0] ?? null);

  if (!strike) {
    throw new Error("Delete failed");
  }

  revalidateStrikes(userId);
}
