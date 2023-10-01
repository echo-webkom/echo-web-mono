import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { type Handler } from "hono";
import { deleteCookie, setSignedCookie } from "hono/cookie";
import { sign } from "hono/jwt";
import { z } from "zod";

import { db, passwords, users } from "@echo-webkom/storage";

const createAccountSchema = z.object({
  firstName: z.string().nonempty(),
  lastName: z.string().nonempty(),
  email: z.string().email(),
  password: z.string().min(8),
});

export const handleCreateAccount: Handler = async (c) => {
  try {
    const data = createAccountSchema.parse(await c.req.raw.json());

    const existingUser = await db.query.users.findFirst({
      where: (u) => eq(u.email, data.email),
    });

    if (existingUser) {
      c.status(409);
      return c.text("User already exists");
    }

    const user = await db.transaction(async (tx) => {
      const user = (
        await tx
          .insert(users)
          .values({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
          })
          .returning()
      )[0];

      const encryptedPassword = await bcrypt.hash(data.password, 10);

      if (!user) {
        throw new Error("User not created");
      }

      await tx.insert(passwords).values({
        userId: user.id,
        password: encryptedPassword,
      });

      return user;
    });

    const jwt = await sign(
      {
        id: user.id,
        firstNams: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      process.env.JWT_SECRET!,
    );

    await setSignedCookie(c, "user", jwt, process.env.JWT_SECRET!, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      domain: "localhost",
      path: "/",
      httpOnly: process.env.NODE_ENV === "production",
      sameSite: "Lax",
    });
    return c.json(data);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return c.json({ error: e.errors });
    }

    c.status(500);
    return c.text("Something went wrong.");
  }
};

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().nonempty(),
});

export const handleLogin: Handler = async (c) => {
  try {
    const data = loginSchema.parse(await c.req.raw.json());

    const user = await db.query.users.findFirst({
      where: (u) => eq(u.email, data.email),
      with: {
        passwords: true,
      },
    });

    if (!user) {
      c.status(404);
      return c.text("User does not exist");
    }

    const password = user.passwords[0];

    if (!password) {
      c.status(404);
      return c.text("User does not exist");
    }

    const isPasswordCorrect = await bcrypt.compare(data.password, password?.password);

    if (!isPasswordCorrect) {
      c.status(403);
      return c.text("Incorrect email and password combination");
    }

    const jwt = await sign(
      {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      process.env.JWT_SECRET!,
    );

    await setSignedCookie(c, "user", jwt, process.env.JWT_SECRET!, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      domain: "localhost",
      path: "/",
      httpOnly: process.env.NODE_ENV === "production",
      sameSite: "Lax",
    });
    return c.text("Logged in");
  } catch (e) {
    if (e instanceof z.ZodError) {
      return c.json({ error: e.errors });
    }

    c.status(500);
    return c.text("Something went wrong.");
  }
};

export const handleSignOut: Handler = (c) => {
  deleteCookie(c, "user", {
    domain: "localhost",
    path: "/",
    httpOnly: process.env.NODE_ENV === "production",
    sameSite: "Lax",
  });

  c.status(200);
  return c.text("Signed out");
};
