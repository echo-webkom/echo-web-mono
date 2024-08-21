import { unstable_cache as cache } from "next/cache";
import { eq } from "drizzle-orm";

import { db } from "@echo-webkom/db";

import { isErrorMessage } from "@/utils/error";
import { cacheKeyFactory } from "./revalidate";

export const getRegistrationsByHappeningId = async (happeningId: string) => {
  return cache(
    async () => {
      return await db.query.registrations
        .findMany({
          where: (registration) => eq(registration.happeningId, happeningId),
          with: {
            user: true,
          },
        })
        .catch((error) => {
          console.error("Failed to fetch registrations", {
            happeningId,
            error: isErrorMessage(error) ? error.message : "Unknown error",
          });

          return [];
        });
    },
    [cacheKeyFactory.registrationsHappening(happeningId)],
    {
      tags: [cacheKeyFactory.registrationsHappening(happeningId)],
    },
  )();
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
