import { cache } from "react";
import { eq } from "drizzle-orm";

import { db } from "@echo-webkom/db";

export const userIsInGroup = async (userId: string, groupIds: Array<string>) => {
  const userGroups = await getUserGroups(userId).then((groups) => groups.map((g) => g.id));
  return groupIds.some((groupId) => userGroups.includes(groupId));
};

export const getUserGroups = cache(async (userId: string) => {
  const memberships = await db.query.usersToGroups.findMany({
    where: (utg) => eq(utg.userId, userId),
    with: {
      group: true,
    },
  });

  return memberships.map((m) => ({
    id: m.groupId,
    name: m.group.name,
    leader: m.group.leader,
  }));
});
