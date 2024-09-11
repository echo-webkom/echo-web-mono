import { unstable_cache as cache } from "next/cache";
import { and, eq } from "drizzle-orm";

import { db } from "@echo-webkom/db";

import { UserWithStrikes } from "@/app/(default)/prikker/table";
import { getAllUsers } from "../users/queries";
import { cacheKeyFactory } from "./revalidate";

export const getAllUsersWithStrikes = cache(
  async () => {
    const users = await getAllUsers();
    const usersWithStrikes: Array<UserWithStrikes> = [];

    for (const user of users) {
      const strikes = (await getAllUserStrikes(user.id)).reverse();

      const validStrikes = strikes.filter((strike) => strike.id >= (user.bannedFromStrike ?? -1));

      usersWithStrikes.push({
        id: user.id,
        name: user.name,
        isBanned: Boolean(user.bannedFromStrike),
        validStrikes: validStrikes.length,
      });
    }

    return usersWithStrikes;
  },
  [cacheKeyFactory.allUsersWithStrikes()],
  {
    tags: [cacheKeyFactory.allUsersWithStrikes()],
  },
);

// Cache the getAllUserStrikes function
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
    [cacheKeyFactory.singleUserStrikes(userId)], // Cache key for strikes of the user
    {
      tags: [cacheKeyFactory.singleUserStrikes(userId)], // Cache tags for invalidation
    },
  )();
};
