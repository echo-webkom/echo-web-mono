import { Hono } from "hono";

import { db } from "@echo-webkom/db";

import { admin } from "../middleware/admin";

const app = new Hono();

app.get("/feedbacks", admin(), async (c) => {
  const feedbacks = await db.query.siteFeedback.findMany({
    orderBy: (row, { desc }) => [desc(row.createdAt)],
  });

  return c.json(feedbacks);
});

app.get("/feedback/:id", admin(), async (c) => {
  const { id } = c.req.param();

  const feedback = await db.query.siteFeedback.findFirst({
    where: (row, { eq }) => eq(row.id, id),
  });

  return c.json(feedback);
});

export default app;
