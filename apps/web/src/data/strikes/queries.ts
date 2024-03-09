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

export async function getAllUserStrikes(userId: string) {
  return cache(
    async () => {
      return await db.query.strikes.findMany({
        with: {
          strikeInfo: {
            with: {
              happening: {
                columns: {
                  id: true,
                  title: true,
                  slug: true,
                },
              },
              issuer: {
                columns: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
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
}
