import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth/next";

import { db } from "@echo-webkom/db/serverless";

import { authOptions } from "./auth-options";

/**
 *
 * @returns user of currently signed in user
 * @internal
 */
export const auth = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return null;
  }

  const user = await db.query.users.findFirst({
    where: (user) => eq(user.id, session.user.id),
    with: {
      degree: true,
      banInfo: true,
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
