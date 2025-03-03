import { unstable_cache as cache } from "next/cache";
import { eq } from "drizzle-orm";

import { type User } from "@echo-webkom/db/schemas";
import { db } from "@echo-webkom/db/serverless";

import { apiServer } from "@/api/server";

export const getUserById = async (id: User["id"]) => {
  return await db.query.users.findFirst({
    where: (user) => eq(user.id, id),
    with: {
      degree: true,
    },
  });
};

export const getAllUsers = async () => {
  return await cache(
    async () => {
      return await db.query.users.findMany({
        orderBy: (user, { asc }) => [asc(user.name)],
        with: {
          degree: true,
          memberships: true,
        },
      });
    },
    ["users"],
    {
      revalidate: 60,
    },
  )();
};

export const getBannedUsers = async () => {
  return await apiServer
    .get<
      Array<{
        id: string;
        name: string | null;
        image: string | null;
        banInfo: {
          id: number;
          reason: string;
          createdAt: Date;
          userId: string;
          bannedBy: string;
          expiresAt: Date;
          bannedByUser: {
            name: string | null;
          };
        };
        dots: Array<{
          id: number;
          reason: string;
          createdAt: Date;
          userId: string;
          expiresAt: Date;
          count: number;
          strikedBy: string;
          strikedByUser: {
            name: string;
          };
        }>;
      }>
    >("strikes/users/banned")
    .json();
};

export const getUsersWithStrikes = async () => {
  return await apiServer
    .get<
      Array<{
        id: string;
        name: string;
        imageUrl: string | null;
        isBanned: boolean;
        strikes: number;
      }>
    >("strikes/users")
    .json();
};
