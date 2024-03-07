import { unstable_cache as cache } from "next/cache";
import { and, count, eq, gt, isNull, or } from "drizzle-orm";

import { db } from "@echo-webkom/db";
import { strikes, users } from "@echo-webkom/db/schemas";

import { cacheKeyFactory } from "./revalidate";

export async function getAllUsersWithValidStrikes() {
  return cache(
    async () => {
      return await db
        .select({
          id: users.id,
          name: users.name,
          isBanned: users.isBanned,
          strikes: count(strikes.id),
        })
        .from(users)
        .leftJoin(
          strikes,
          and(
            eq(users.id, strikes.userId),
            eq(strikes.isDeleted, false),
            or(isNull(users.bannedFromStrike), gt(strikes.id, users.bannedFromStrike)),
          ),
        )
        .groupBy(users.id);
    },
    [cacheKeyFactory.allUsersStrikes()],
    {
      tags: [cacheKeyFactory.allUsersStrikes()],
      revalidate: 60, // to be deleted
    },
  )();
}
