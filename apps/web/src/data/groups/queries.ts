import { unstable_cache as cache } from "next/cache";
import { eq } from "drizzle-orm";

import { db } from "@echo-webkom/db";
import { type User } from "@echo-webkom/db/schemas";

import { cacheKeyFactory } from "./revalidate";

export async function getUserStudentGroups(userId: User["id"]) {
  return await db.query.usersToGroups.findMany({
    where: (userToGroup) => eq(userToGroup.userId, userId),
  });
}

export async function getStudentGroups() {
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
}

export async function getStudentGroupsWithMembers() {
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
}
