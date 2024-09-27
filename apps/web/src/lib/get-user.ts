import { cache } from "react";
import { cookies } from "next/headers";

import { type User, type UsersToGroups } from "@echo-webkom/db/schemas";

import { apiServer } from "@/api/server";

/**
 * Wraps the `auth` function in a "cache" to prevent
 * multiple calls to the auth server.
 *
 * This cache only lives for the duration of the page
 * load.
 */
export const getUser = cache(async () => {
  const cookieStore = cookies();

  const sessionId = cookieStore.get("auth_session")?.value;

  if (!sessionId) {
    return null;
  }

  try {
    const { user } = await apiServer
      .post("auth/user", {
        json: {
          sessionId,
        },
      })
      .json<{
        user: User & {
          memberships: Array<UsersToGroups>;
        };
        session: {
          id: string;
          userId: string;
          fresh: boolean;
          expiresAt: string;
        };
      }>();

    return user;
  } catch (e) {
    console.error("Failed to fetch user");

    return null;
  }
});
