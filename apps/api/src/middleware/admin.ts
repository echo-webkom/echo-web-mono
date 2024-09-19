import { createMiddleware } from "hono/factory";

export const admin = () => {
  return createMiddleware(async (c, next) => {
    const bearerToken = c.req.header("Authorization");

    if (bearerToken !== "Bearer foobar") {
      return c.json({ error: "Unauthorized" }, 401);
    }

    return await next();
  });
};
