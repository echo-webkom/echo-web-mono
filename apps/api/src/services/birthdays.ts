import { Hono } from "hono";

import { db } from "@/lib/db";

const app = new Hono();

const isToday = (date: Date) =>
  date.getMonth() === new Date().getMonth() && date.getDate() === new Date().getDate();

app.get("/birthdays", async (c) => {
  const users = await db.query.users
    .findMany({
      where: (row, { isNotNull }) => isNotNull(row.birthday),
    })
    .then((res) => res.filter((user) => user.birthday && isToday(user.birthday)));

  return c.json(users.map((user) => user.name));
});

export default app;
