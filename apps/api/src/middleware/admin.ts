import { createMiddleware } from "hono/factory";

export const admin = () => {
  return createMiddleware(async (c, next) => {
    const bearerToken = c.req.header("Authorization");

    if (bearerToken !== `Bearer ${Deno.env.get("ADMIN_KEY")}`) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    return await next();
  });
};
