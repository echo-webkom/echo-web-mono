import { eq } from "drizzle-orm";
import { type Handler } from "hono";

import { db } from "@echo-webkom/storage";

import { getUser } from "@/lib/user";

export const handleGetSelf: Handler = async (c) => {
  const user = await getUser(c);

  if (!user) {
    c.status(403);
    return c.text("You're not logged in");
  }

  return c.json(user);
};

export const handleGetSelfRegistrations: Handler = async (c) => {
  const user = await getUser(c);

  if (!user) {
    c.status(403);
    return c.text("You're not logged in");
  }

  const registrations = await db.query.registrations.findMany({
    where: (r) => eq(r.userId, user.id),
    with: {
      happening: true,
    },
  });

  return c.json(registrations);
};
