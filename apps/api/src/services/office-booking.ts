import { Hono } from "hono";

import { db } from "../lib/db";
import { admin } from "../middleware/admin";

const app = new Hono();

app.get("/office-booking", admin(), async (c) => {
  const items = await db.query.officeBookings.findMany({
    with: { user: true },
  });
  return c.json(items);
});

export default app;
