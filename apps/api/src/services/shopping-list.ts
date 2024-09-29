import { createApp } from "../lib/hono";
import { admin } from "../middleware/admin";

const app = createApp();

app.get("/shopping", admin(), async (c) => {
  const items = await c.var.db.query.shoppingListItems.findMany({
    with: { likes: true, user: true },
  });

  return c.json(items);
});

export default app;
