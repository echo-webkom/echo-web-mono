import { Hono } from "hono";

import { db } from "@echo-webkom/db";

const app = new Hono();

app.get("/shopping", async (c) => {
  const items = await db.query.shoppingListItems
    .findMany({
      with: { likes: true, user: true },
    })
    .catch(() => {
      return [];
    });

  return c.json(items);
});

export default app;
