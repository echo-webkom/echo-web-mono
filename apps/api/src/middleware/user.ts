import { eq, type InferSelectModel } from "drizzle-orm";
import { type MiddlewareHandler } from "hono";
import { getCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";
import { verify } from "hono/jwt";

import { db, type users } from "@echo-webkom/storage";

import { USER_COOKIE_NAME } from "@/constants";
import { type JWTPayload } from "@/lib/jwt";

declare module "hono" {
  interface ContextVariableMap {
    user: InferSelectModel<typeof users>;
  }
}

export const user = (): MiddlewareHandler => {
  return async (c, next) => {
    const cookie = getCookie(c, USER_COOKIE_NAME);

    if (!cookie) {
      const res = new Response("Unauthorized", {
        status: 401,
        headers: {
          "WWW-Authenticate": `Bearer realm="${c.req.url}",error="invalid_request",error_description="no authorization included in request"`,
        },
      });
      throw new HTTPException(401, { res });
    }

    const payload = (await verify(cookie, process.env.JWT_SECRET!)) as JWTPayload;

    if (!payload) {
      const res = new Response("Unauthorized", {
        status: 401,
        headers: {
          "WWW-Authenticate": `Bearer realm="${c.req.url}",error="invalid_token",error_description="token verification failure"`,
        },
      });
      throw new HTTPException(401, { res });
    }

    const user = await db.query.users.findFirst({
      where: (u) => eq(u.id, payload.sub),
    });

    c.set("user", user);

    return await next();
  };
};
