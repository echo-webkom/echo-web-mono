import type { MiddlewareHandler } from "hono";

import type { Bindings } from "./create-app";

/**
 * Check if the request authorization header matches the secret
 *
 * @param c hono context
 * @param next next handler
 * @returns the next handler
 */
export const auth: MiddlewareHandler<{ Bindings: Bindings }> = async (c, next) => {
  if (!c.env.ADMIN_KEY) {
    return next();
  }

  const token = c.req.header("Authorization");
  if (token !== `Bearer ${c.env.ADMIN_KEY}`) {
    return c.text("Unauthorized", { status: 401 });
  }

  return next();
};
