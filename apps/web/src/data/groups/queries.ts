import { unstable_cache as cache } from "next/cache";
import { eq } from "drizzle-orm";

import { type User } from "@echo-webkom/db/schemas";
import { db } from "@echo-webkom/db/serverless";

import { cacheKeyFactory } from "./revalidate";

export const getUserStudentGroups = async (userId: User["id"]) => {
  return await db.query.usersToGroups.findMany({
    where: (userToGroup) => eq(userToGroup.userId, userId),
  });
};

export const getStudentGroups = async () => {
  return await cache(
    async () => {
      return await db.query.groups.findMany({
        orderBy: (group, { asc }) => [asc(group.name)],
      });
    },
    [cacheKeyFactory.groups],
    {
      tags: [cacheKeyFactory.groups],
    },
  )();
};

export const getStudentGroupsWithMembers = async () => {
  return await cache(
    async () => {
      return await db.query.groups.findMany({
        orderBy: (group, { asc }) => [asc(group.name)],
        with: {
          members: {
            with: {
              user: true,
            },
          },
        },
      });
    },
    [cacheKeyFactory.groups],
    {
      tags: [cacheKeyFactory.groups],
    },
  )();
};
