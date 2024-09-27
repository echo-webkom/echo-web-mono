import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { Session, User } from "lucia";

import { lucia } from "../lib/auth/lucia";

export const auth = () => {
  return createMiddleware<{
    Variables: {
      user: User;
      session: Session;
    };
  }>(async (c, next) => {
    const sessionId = getCookie(c, lucia.sessionCookieName);

    if (!sessionId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { user, session } = await lucia.validateSession(sessionId);

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    c.set("user", user);
    c.set("session", session);

    return await next();
  });
};
