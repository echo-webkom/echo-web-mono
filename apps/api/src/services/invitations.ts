import { Hono } from "hono";

import { db } from "@echo-webkom/db/serverless";

import { admin } from "../middleware/admin";

const app = new Hono();

app.get("/invitations/:userId", admin(), async (c) => {
  const { userId } = c.req.param();
  const items = db.query.invitations.findMany({
    where: (row, { eq }) => eq(row.userId, userId),
    with: {
      happening: true,
    },
  });

  return c.json(items);
});

export default app;
