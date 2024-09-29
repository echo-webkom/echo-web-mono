import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

import { degrees, insertDegreeSchema } from "@echo-webkom/db/schemas";

import { createApp } from "../lib/hono";
import { admin } from "../middleware/admin";
import { parseJson } from "../utils/json";

const app = createApp();

app.get("/degrees", async (c) => {
  const degrees = await c.var.db.query.degrees.findMany({
    orderBy: (row, { asc }) => [asc(row.name)],
  });

  return c.json(degrees);
});

app.post("/degrees", admin(), async (c) => {
  const { ok, json } = await parseJson(c, insertDegreeSchema);

  if (!ok) {
    return c.json({ error: "Invalid input" }, 400);
  }

  await c.var.db.insert(degrees).values(json);

  return c.json({ success: true });
});

app.post("/degree/:id", admin(), async (c) => {
  const { id } = c.req.param();
  const { ok, json } = await parseJson(c, z.object({ id: z.string(), name: z.string() }));

  if (!ok) {
    return c.json({ error: "Invalid input" }, 400);
  }

  await c.var.db.update(degrees).set(json).where(eq(degrees.id, id));

  return c.json({ success: true });
});

app.delete("/degree/:id", admin(), async (c) => {
  const { id } = c.req.param();

  await c.var.db.delete(degrees).where(eq(degrees.id, id));

  return c.json({ success: true });
});

export default app;
