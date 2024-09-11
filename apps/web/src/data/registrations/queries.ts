import { unstable_cache as cache } from "next/cache";
import { eq } from "drizzle-orm";

import { type Registration, type User } from "@echo-webkom/db/schemas";
import { db } from "@echo-webkom/db/serverless";

import { apiServer } from "@/api/server";
import { cacheKeyFactory } from "./revalidate";

export const getRegistrationsByHappeningId = async (happeningId: string) => {
  return await apiServer.get(`happening/${happeningId}/registrations`).json<
    Array<
      Registration & {
        user: User;
      }
    >
  >();
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
