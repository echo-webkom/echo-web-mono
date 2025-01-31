import { Hono } from "hono";

import { db } from "@/lib/db";

const app = new Hono();

app.get("/birthdays", async (c) => {
  const users = await db.query.users.findMany({
    where: (row, { isNotNull }) => isNotNull(row.birthday),
  });

  return c.json(
    users.map((user) => {
      return {
        name: user.name,
        birthday: user.birthday,
      };
    }),
  );
});

export default app;
