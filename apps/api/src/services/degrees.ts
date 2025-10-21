import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

import { degrees, insertDegreeSchema } from "@echo-webkom/db/schemas";

import { db } from "../lib/db";
import { admin } from "../middleware/admin";

const app = new Hono();

app.get("/degrees", async (c) => {
  const degrees = await db.query.degrees.findMany({
    orderBy: (row, { asc }) => [asc(row.name)],
  });

  return c.json(degrees);
});

app.post("/degrees", admin(), async (c) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const json = await c.req.json();
  const { success, data } = insertDegreeSchema.safeParse(json);

  if (!success) {
    return c.json({ error: "Invalid input" }, 400);
  }

  await db.insert(degrees).values(data);

  return c.json({ success: true });
});

const CreateDegreeRequestBodySchema = z.object({
  id: z.string(),
  name: z.string(),
});

app.post("/degree/:id", admin(), async (c) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const json = await c.req.json();
  const { id } = c.req.param();
  const { success, data } = CreateDegreeRequestBodySchema.safeParse(json);

  if (!success) {
    return c.json({ error: "Invalid input" }, 400);
  }

  await db.update(degrees).set(data).where(eq(degrees.id, id));

  return c.json({ success: true });
});

app.delete("/degree/:id", admin(), async (c) => {
  const { id } = c.req.param();

  await db.delete(degrees).where(eq(degrees.id, id));

  return c.json({ success: true });
});

export default app;
