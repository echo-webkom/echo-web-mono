import { Hono } from "hono";

import { createApp } from "../lib/hono";
import { admin } from "../middleware/admin";

const app = createApp();

app.get("/happenings", async (c) => {
  const happenings = await c.var.db.query.happenings.findMany();

  return c.json(happenings);
});

app.get("/happening/:id", async (c) => {
  const { id } = c.req.param();

  const happening = await c.var.db.query.happenings.findFirst({
    where: (row, { eq }) => eq(row.id, id),
  });

  if (!happening) {
    return c.json({ error: "Not found" }, 404);
  }

  return c.json(happening);
});

app.get("/happening/:id/registrations/count", async (c) => {
  const { id } = c.req.param();

  const [spotRanges, registrations] = await Promise.all([
    c.var.db.query.spotRanges.findMany({
      where: (row, { eq }) => eq(row.happeningId, id),
    }),
    c.var.db.query.registrations.findMany({
      where: (row, { eq }) => eq(row.happeningId, id),
    }),
  ]);

  let max: number | null = null;

  if (spotRanges.length > 0) {
    max = spotRanges.reduce((acc, range) => acc + range.spots, 0);
  }

  const grouped = registrations.reduce(
    (acc, registration) => {
      const { status } = registration;

      if (status === "waiting") {
        acc.waiting++;
      } else if (status === "registered") {
        acc.registered++;
      }

      return acc;
    },
    {
      waiting: 0,
      registered: 0,
      max,
    },
  );

  return c.json(grouped);
});

app.get("/happening/:id/registrations", admin(), async (c) => {
  const { id } = c.req.param();

  const registrations = await c.var.db.query.registrations.findMany({
    where: (row, { eq }) => eq(row.happeningId, id),
    with: {
      user: true,
    },
  });

  return c.json(registrations);
});

app.get("/happening/:id/spot-ranges", admin(), async (c) => {
  const { id } = c.req.param();

  const spotRanges = await c.var.db.query.spotRanges.findMany({
    where: (row, { eq }) => eq(row.happeningId, id),
  });

  return c.json(spotRanges);
});

app.get("/happening/:id/questions", async (c) => {
  const { id } = c.req.param();

  const questions = await c.var.db.query.questions.findMany({
    where: (row, { eq }) => eq(row.happeningId, id),
  });

  return c.json(questions);
});

export default app;
