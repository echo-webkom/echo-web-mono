import { unstable_cache as cache } from "next/cache";
import { eq } from "drizzle-orm";

import { type RegistrationStatus } from "@echo-webkom/db/schemas";
import { db } from "@echo-webkom/db/serverless";

import { apiServer } from "@/api/server";
import { cacheKeyFactory } from "./revalidate";

export const getRegistrationsByHappeningId = async (happeningId: string) => {
  return await apiServer.get(`happenings/${happeningId}/registrations`).json<
    Array<{
      changedAt: Date;
      changedBy: Date;
      createdAt: Date;
      happeningId: string;
      prevStatus: string;
      status: RegistrationStatus;
      unregisterReason: string;
      userId: string;
      userName: string | null;
      userImage: string | null;
    }>
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

export const getRegistrationCountByHappeningIds = async (happeningIds: Array<string>) => {
  if (happeningIds.length === 0) {
    return [];
  }

  return await apiServer.get(`happenings/registrations/count?id=${happeningIds.join("&id=")}`).json<
    Array<{
      happeningId: string;
      waiting: number;
      registered: number;
      max: number | null;
    }>
  >();
};
