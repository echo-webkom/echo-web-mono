import { lte } from "drizzle-orm";
import { Hono } from "hono";

import { banInfos, dots } from "@echo-webkom/db/schemas";

import { db } from "@/lib/db";
import { admin } from "@/middleware/admin";

const app = new Hono();

app.get("/strikes/unban", admin(), async (c) => {
  await db.delete(dots).where(lte(dots.expiresAt, new Date()));
  await db.delete(banInfos).where(lte(banInfos.expiresAt, new Date()));

  return c.json({ message: "Removed expired bans and strikes" });
});

export default app;
