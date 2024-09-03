import { unstable_cache as cache } from "next/cache";
import { and, count, eq, gt, isNull, or } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { strikes, users } from "@/db/schemas";
import { cacheKeyFactory } from "./revalidate";

export const getAllUsersWithValidStrikes = async () => {
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
};

export const getAllUserStrikes = async (userId: string) => {
  return cache(
    async () => {
      return await db.query.strikes.findMany({
        with: {
          strikeInfo: {
            with: {
              happening: true,
              issuer: true,
            },
          },
        },
        where: (strike) => and(eq(strike.isDeleted, false), eq(strike.userId, userId)),
      });
    },
    [cacheKeyFactory.singleUserStrikes(userId)],
    {
      tags: [cacheKeyFactory.singleUserStrikes(userId)],
    },
  )();
};
