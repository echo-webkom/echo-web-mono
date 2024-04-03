import { unstable_cache as cache } from "next/cache";
import { eq } from "drizzle-orm";

import { db } from "@echo-webkom/db";

import { Logger } from "@/lib/logger";
import { cacheKeyFactory } from "./revalidate";

export async function getRegistrationsByHappeningId(happeningId: string) {
  return cache(
    async () => {
      return await db.query.registrations
        .findMany({
          where: (registration) => eq(registration.happeningId, happeningId),
          with: {
            user: true,
          },
        })
        .catch(() => {
          Logger.error(
            getRegistrationsByHappeningId.name,
            `Failed to fetch registrations for happening with ID: ${happeningId}`,
          );

          return [];
        });
    },
    [cacheKeyFactory.registrationsHappening(happeningId)],
    {
      tags: [cacheKeyFactory.registrationsHappening(happeningId)],
    },
  )();
}

export async function getRegistrationsByUserId(userId: string) {
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
          Logger.error(
            getRegistrationsByUserId.name,
            `Failed to fetch registrations for user with ID: ${userId}`,
          );

          return [];
        });
    },
    [cacheKeyFactory.registrationsUser(userId)],
    {
      tags: [cacheKeyFactory.registrationsUser(userId)],
    },
  )();
}
