import { eq } from "drizzle-orm";
import { getServerSession as _getServerSession } from "next-auth/next";

import { db } from "@/db/drizzle";
import { createAuthOptions } from "./auth-options";

const authOptions = createAuthOptions();

/**
 *
 * @returns session of currently signed in user
 */
export const getAuthSession = async () => {
  const session = await _getServerSession(authOptions);

  if (!session) {
    return null;
  }

  return session;
};

/**
 *
 * @returns user of currently signed in user
 */
export const auth = async () => {
  const session = await getAuthSession();

  if (!session) {
    return null;
  }

  const user = await db.query.users.findFirst({
    where: (user) => eq(user.id, session.user.id),
    with: {
      degree: true,
      memberships: {
        with: {
          group: true,
        },
      },
    },
  });

  if (!user) {
    console.error(`User ${session.user.id} not found in database`);
    return null;
  }

  return user;
};
