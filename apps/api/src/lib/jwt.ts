import { type Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { sign } from "hono/jwt";

import { USER_COOKIE_NAME } from "@/constants";

const secret = process.env.JWT_SECRET!;
export const jwtConfig = { secret, cookie: USER_COOKIE_NAME };

export type JWTPayload = {
  sub: string;
  email: string;
  firstName: string;
  lastName: string;
};

export const getJwtPayload = (c: Context): JWTPayload => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const jwt = c.get("jwtPayload");

  if (!jwt) {
    const res = new Response("Unauthorized", {
      status: 401,
      headers: {
        "WWW-Authenticate": `Bearer realm="${c.req.url}",error="invalid_request",error_description="no authorization included in request"`,
      },
    });
    throw new HTTPException(401, { res });
  }

  return jwt as JWTPayload;
};

export const createJWT = async <
  T extends {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  },
>(
  user: T,
) => {
  return sign(
    {
      sub: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      iat: Math.floor(Date.now() / 1000),
    },
    process.env.JWT_SECRET!,
  );
};
