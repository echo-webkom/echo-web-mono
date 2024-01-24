import { eq } from "drizzle-orm";

import { db } from "@echo-webkom/db";
import { type User } from "@echo-webkom/db/schemas";

export async function getUserStudentGroups(userId: User["id"]) {
  return await db.query.usersToGroups.findMany({
    where: (userToGroup) => eq(userToGroup.userId, userId),
  });
}

export async function getStudentGroups() {
  return await db.query.groups.findMany();
}
