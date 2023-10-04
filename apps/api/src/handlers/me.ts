import { eq } from "drizzle-orm";
import { type Handler } from "hono";
import { z } from "zod";

import { db, degreeEnum, users, yearEnum } from "@echo-webkom/storage";

import { getJwtPayload } from "@/lib/jwt";

export const handleGetSelf: Handler = async (c) => {
  const user = c.get("user");

  if (!user) {
    c.status(404);
    return c.text("User not found");
  }

  return c.json(user);
};

export const handleGetSelfRegistrations: Handler = async (c) => {
  const jwt = getJwtPayload(c);

  const registrations = await db.query.registrations.findMany({
    where: (r) => eq(r.userId, jwt.sub),
    with: {
      happening: true,
    },
  });

  return c.json(registrations);
};

const updateSelfSchema = z.object({
  firstName: z.string().nonempty().optional(),
  lastName: z.string().nonempty().optional(),
  email: z.string().email().optional(),
  degree: z.enum(degreeEnum.enumValues).optional(),
  year: z.enum(yearEnum.enumValues).optional(),
});

export const handleUpdateSelf: Handler = async (c) => {
  try {
    const jwt = getJwtPayload(c);

    const data = updateSelfSchema.parse(await c.req.raw.json());

    const user = await db.query.users.findFirst({
      where: (u) => eq(u.id, jwt.sub),
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
        .where(eq(users.id, jwt.sub))
        .returning()
    )[0];

    return c.json(updatedUser);
  } catch {
    c.status(400);
    return c.text("Invalid request");
  }
};
