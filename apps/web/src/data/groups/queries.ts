import { eq } from "drizzle-orm";

import { type User } from "@echo-webkom/db/schemas";
import { db } from "@echo-webkom/db/serverless";

export const getUserStudentGroups = async (userId: User["id"]) => {
  return await db.query.usersToGroups.findMany({
    where: (userToGroup) => eq(userToGroup.userId, userId),
  });
};

export const getStudentGroups = async () => {
  return await db.query.groups.findMany({
    orderBy: (group, { asc }) => [asc(group.name)],
  });
};

export const getStudentGroupsWithMembers = async () => {
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
};
