import { Hono } from "hono";

import { db } from "@echo-webkom/db/serverless";

import { admin } from "../middleware/admin";

const app = new Hono();

app.get("/shopping", admin(), async (c) => {
  const items = await db.query.shoppingListItems.findMany({
    with: { likes: true, user: true },
  });

  return c.json(items);
});

export default app;
