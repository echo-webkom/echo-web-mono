import { type Context } from "hono";
import { getSignedCookie } from "hono/cookie";
import { verify } from "hono/jwt";

import { getUserByEmail } from "@echo-webkom/storage";

export const getUser = async (c: Context) => {
  const jwt = await getSignedCookie(c, process.env.JWT_SECRET!, "user");

  if (!jwt) {
    return null;
  }

  const { email } = await verify(jwt, process.env.JWT_SECRET!);

  const user = await getUserByEmail(email as string);

  return user;
};
