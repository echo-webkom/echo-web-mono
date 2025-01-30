import { cache } from "react";
import { eq } from "drizzle-orm";

import { users } from "@echo-webkom/db/schemas";
import { db } from "@echo-webkom/db/serverless";

import { auth } from "@/auth/helpers";

/**
 * Wraps the `auth` function in a "cache" to prevent
 * multiple calls to the auth server.
 *
 * This cache only lives for the duration of the page
 * load.
 */
export const getUser = cache(auth);

export const getUserById = cache(async (id: string) => {
  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
    with: {
      degree: true,
      memberships: {
        with: {
          group: true,
        },
      },
    },
  });

  return user;
});
