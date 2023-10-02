import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { verify } from "hono/jwt";

import { db } from "@echo-webkom/storage";

export type JWTPayload = {
  sub: string;
  firstName: string;
  lastName: string;
  email: string;
  iat: number;
};

/**
 * Get the JWT payload for the currently logged in user. Also validates the JWT.
 *
 * @returns The JWT payload if the user is logged in, otherwise null
 */
export async function getJwtPayload() {
  const jwt = cookies().get("user")?.value;

  if (!jwt) {
    return null;
  }

  const payload = (await verify(jwt, process.env.JWT_SECRET!)) as JWTPayload;

  return payload;
}

type GetCurrentUserOptions = {
  with?: {
    registrations?: true;
    groups?: true;
  };
};

const defaultGetCurrentUserOptions: GetCurrentUserOptions = {
  with: {
    registrations: undefined,
    groups: undefined,
  },
};

export async function getCurrentUser(
  options: GetCurrentUserOptions = defaultGetCurrentUserOptions,
) {
  const payload = await getJwtPayload();

  if (!payload) {
    return null;
  }

  const user = await db.query.users.findFirst({
    where: (u) => eq(u.id, payload.sub),
    with: {
      groups: options.with?.groups,
      registrations: options.with?.registrations,
    },
  });

  return user ?? null;
}
