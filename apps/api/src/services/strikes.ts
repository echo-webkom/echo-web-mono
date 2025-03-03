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

app.get("/strikes/users", admin(), async (c) => {
  const users = await db.query.users
    .findMany({
      with: {
        dots: true,
        banInfo: true,
      },
    })
    .then((users) =>
      users.map((user) => ({
        id: user.id,
        name: user.name ?? "Ingen navn",
        imageUrl: user.image,
        isBanned: user.banInfo !== null,
        strikes: user.dots.reduce((acc, dot) => acc + dot.count, 0),
      })),
    );

  return c.json(users);
});

app.get("/strikes/users/banned", admin(), async (c) => {
  const users = await db.query.users
    .findMany({
      orderBy: (user, { asc }) => [asc(user.name)],
      columns: {
        id: true,
        name: true,
        image: true,
      },
      with: {
        dots: {
          with: {
            strikedByUser: {
              columns: {
                name: true,
              },
            },
          },
        },
        banInfo: {
          with: {
            bannedByUser: {
              columns: {
                name: true,
              },
            },
          },
        },
      },
    })
    .then((users) => users.filter((user) => user.dots.length > 0 || user.banInfo !== null));

  return c.json(users);
});

export default app;
