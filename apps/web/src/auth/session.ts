import { cache } from "react";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { jwtVerify, SignJWT } from "jose";

import { sessions } from "@echo-webkom/db/schemas";
import { db } from "@echo-webkom/db/serverless";

const getSecret = () => {
  const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
  if (!secret.length) {
    throw new Error("AUTH_SECRET environment variable is not set");
  }
  return secret;
};

export const SESSION_COOKIE_NAME = "session-token";

async function getSessionCookie(): Promise<string | null> {
  const cookieStore = await cookies();

  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(sessionCookie, getSecret());
    return payload.sessionId as string;
  } catch {
    return null; // Invalid or expired token
  }
}

export async function getSession() {
  const sessionId = await getSessionCookie();

  if (!sessionId) {
    return null;
  }

  const session = await db.query.sessions.findFirst({
    where: (session) => eq(session.sessionToken, sessionId),
    with: {
      user: true,
    },
  });

  if (!session) {
    return null;
  }

  if (session.expires && session.expires < new Date()) {
    console.warn(`Session ${sessionId} has expired`);
    await db.delete(sessions).where(eq(sessions.sessionToken, sessionId));
    return null;
  }

  return session;
}

export async function createSessionCookie(sessionId: string) {
  return await new SignJWT({ sessionId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30d")
    .sign(getSecret());
}

export async function signOut() {
  const cookieStore = await cookies();
  const sessionId = await getSessionCookie();

  if (!sessionId) {
    return;
  }

  // Clear the session cookie
  cookieStore.delete(SESSION_COOKIE_NAME);

  // Delete the session from the database
  await db.delete(sessions).where(eq(sessions.sessionToken, sessionId));
}

export type AuthSessionUser = Awaited<ReturnType<typeof auth>>;

export const getProfileOwner = cache(async (userId: string) => {
  const session = await getSession();

  if (!session) {
    return null;
  }

  const user = await db.query.users.findFirst({
    where: (user) => eq(user.id, userId),
    with: {
      degree: true,
      banInfo: true,
      memberships: {
        with: {
          group: true,
        },
      },
    },
  });

  if (!user) {
    console.error(`User ${userId} not found in database`);
    return null;
  }

  return user;
});

export const auth = cache(async () => {
  const session = await getSession();

  if (!session) {
    return null;
  }

  const user = await db.query.users.findFirst({
    where: (user) => eq(user.id, session.user.id),
    with: {
      degree: true,
      banInfo: true,
      memberships: {
        with: {
          group: true,
        },
      },
    },
  });

  if (!user) {
    console.error(`User ${session.user.id} not found in database`);
    return null;
  }

  return user;
});
