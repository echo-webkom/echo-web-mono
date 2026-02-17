import { unstable_cache as cache } from "next/cache";
import { eq } from "drizzle-orm";

import { db } from "@echo-webkom/db/serverless";

import { unoWithAdmin } from "@/api/server";
import { cacheKeyFactory } from "./revalidate";

export const getRegistrationsByHappeningId = async (happeningId: string) => {
  return await unoWithAdmin.happenings.registrations(happeningId);
};

export const getRegistrationsByUserId = async (userId: string) => {
  return cache(
    async () => {
      return await db.query.registrations
        .findMany({
          where: (registration) => eq(registration.userId, userId),
          with: {
            happening: true,
          },
        })
        .catch(() => {
          console.error("Failed to fetch user registrations", {
            userId,
          });

          return [];
        });
    },
    [cacheKeyFactory.registrationsUser(userId)],
    {
      tags: [cacheKeyFactory.registrationsUser(userId)],
    },
  )();
};

export const getRegistrationCountByHappeningIds = async (happeningIds: Array<string>) => {
  if (happeningIds.length === 0) {
    return [];
  }

  return await unoWithAdmin.happenings.registrationCount(happeningIds);
};
