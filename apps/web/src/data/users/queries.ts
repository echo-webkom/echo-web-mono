import { unstable_cache as cache } from "next/cache";
import { eq } from "drizzle-orm";

import { type User } from "@echo-webkom/db/schemas";
import { db } from "@echo-webkom/db/serverless";

import { unoWithAdmin } from "../../api/server";

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
  return await unoWithAdmin.strikes.listBanned();
};

export const getUsersWithStrikes = async () => {
  return await unoWithAdmin.strikes.listStriked();
};
