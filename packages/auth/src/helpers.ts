import { eq, sql } from "drizzle-orm";
import { getServerSession as _getServerSession } from "next-auth/next";

import { db } from "@echo-webkom/db";

import { authOptions } from "./auth-options";

/**
 *
 * @returns session of currently signed in user
 */
export async function getAuthSession() {
  const session = await _getServerSession(authOptions);

  if (!session) {
    return null;
  }

  return session;
}

/**
 * Prepeared statement for getting the user. This is to speed up database queries.
 */
const getUserById = db.query.users
  .findFirst({
    where: (user) => eq(user.id, sql.placeholder("userId")),
    with: {
      degree: true,
      memberships: {
        with: {
          group: true,
        },
      },
    },
  })
  .prepare("get-user-by-id");

/**
 *
 * @returns user of currently signed in user
 */
export async function auth() {
  const session = await getAuthSession();

  if (!session) {
    return null;
  }

  const user = await getUserById.execute({
    userId: session.user.id,
  });

  if (!user) {
    console.error(`User ${session.user.id} not found in database`);
    return null;
  }

  return user;
}
