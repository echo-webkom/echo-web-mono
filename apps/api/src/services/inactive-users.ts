import { Hono } from "hono";

import { db } from "@/lib/db";

const app = new Hono();

app.get("/inactive-users", async (c) => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const users = await db.query.users.findMany({
    where: (row, { isNotNull, lte }) =>
      isNotNull(row.lastSignInAt) && lte(row.lastSignInAt, sixMonthsAgo),
  });
  return c.json(users.map((user) => user.email));
});
