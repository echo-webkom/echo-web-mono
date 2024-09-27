import { Hono } from "hono";

import { auth } from "../middleware/auth";

const app = new Hono();

app.get("/me", auth(), async (c) => {
  return c.json(c.var.user);
});

export default app;
