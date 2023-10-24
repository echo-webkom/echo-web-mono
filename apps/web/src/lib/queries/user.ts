import { eq } from "drizzle-orm";

import { db } from "@echo-webkom/db";
import { type User } from "@echo-webkom/db/schemas";

export async function getUserById(id: User["id"]) {
  return await db.query.users.findFirst({
    where: (user) => eq(user.id, id),
    with: {
      degree: true,
    },
  });
}

export async function getUserRegistrations(id: User["id"]) {
  return await db.query.registrations.findMany({
    where: (registration) => eq(registration.userId, id),
    with: {
      happening: true,
    },
  });
}

export async function getAllUsers() {
  return await db.query.users.findMany({
    with: {
      degree: true,
      memberships: {
        with: {
          group: true,
        },
      },
    },
  });
}
