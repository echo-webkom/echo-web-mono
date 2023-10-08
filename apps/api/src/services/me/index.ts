import { eq } from "drizzle-orm";
import { Hono } from "hono";

import { db, users } from "@echo-webkom/storage";

import { user } from "@/middleware/user";
import { updateSelfSchema } from "./schemas";

const meService = new Hono();

meService.get("/me", user(), (c) => {
  const user = c.get("user");

  return c.json(user);
});

meService.patch("/me", user(), async (c) => {
  try {
    const reqUser = c.get("user");

    const data = updateSelfSchema.parse(await c.req.raw.json());

    const user = await db.query.users.findFirst({
      where: (u) => eq(u.id, reqUser.id),
    });

    if (!user) {
      c.status(404);
      return c.text("User not found");
    }

    const updatedUser = (
      await db
        .update(users)
        .set({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          degree: data.degree,
          year: data.year,
        })
        .where(eq(users.id, reqUser.id))
        .returning()
    )[0];

    return c.json(updatedUser);
  } catch {
    c.status(400);
    return c.text("Invalid request");
  }
});

meService.get("/me/registrations", user(), async (c) => {
  const reqUser = c.get("user");

  const registrations = await db.query.registrations.findMany({
    where: (r) => eq(r.userId, reqUser.id),
    with: {
      happening: true,
    },
  });

  return c.json(registrations);
});

export default meService;
