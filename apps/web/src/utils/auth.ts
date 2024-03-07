import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";

import { auth } from "@echo-webkom/auth";

type GetUserOptions =
  | Record<string, never>
  | {
      enforceAuth: true;
      redirectTo?: string;
    };

/**
 * Gets the current user.
 *
 * If `enforceAuth` is true, it will redirect to `redirectTo`
 * if the user is not authenticated.
 *
 * Could be sketchy to cache a redirect, but it should be
 * fine since the cache is cleared on every request. Reason
 * for caching is to avoid multiple requests to the auth
 * server.
 *
 * Example:
 *
 * ```tsx
 * import { getUser } from "@/utils/auth";
 *
 * export default async function HomePage() {
 *  const session = await getUser({
 *   enforceAuth: true,
 *  });
 *
 *  return (
 *   <h1>You must be authenticated to see this page</h1>
 *  );
 * }
 */
export const getUser = cache(async (options: GetUserOptions = {}) => {
  const user = await auth();

  if (options.enforceAuth) {
    if (!user) {
      return redirect(options.redirectTo ?? "/404");
    }

    return user;
  }

  return user;
});
