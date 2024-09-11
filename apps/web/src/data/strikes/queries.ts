import { unstable_cache as cache } from "next/cache";
import { and, eq } from "drizzle-orm";

import { db } from "@echo-webkom/db";

import { type UserWithStrikes } from "@/app/(default)/prikker/table";
import { cacheKeyFactory } from "./revalidate";

export const getAllUsersWithStrikes = cache(
  async () => {
    const usersWithStrikes = await db.query.users.findMany({
      with: {
        strikes: {
          with: {
            strikeInfo: {
              with: {
                happening: true,
                issuer: true,
              },
            },
          },
          where: (strike) => and(eq(strike.isDeleted, false)),
        },
      },
    });

    const result: Array<UserWithStrikes> = usersWithStrikes.map((user) => {
      const validStrikes = user.strikes.filter(
        (strike) => strike.id >= (user.bannedFromStrike ?? -1),
      );

      return {
        id: user.id,
        name: user.name,
        isBanned: Boolean(user.bannedFromStrike),
        validStrikes: validStrikes.length,
      };
    });

    return result;
  },
  [cacheKeyFactory.allUsersWithStrikes()],
  {
    tags: [cacheKeyFactory.allUsersWithStrikes()],
  },
);

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
