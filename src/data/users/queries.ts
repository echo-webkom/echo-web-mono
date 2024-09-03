import { unstable_cache as cache } from "next/cache";
import { eq } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { type User } from "@/db/schemas";

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
  return await db.query.users.findMany({
    where: (user) => eq(user.isBanned, true),
  });
};
