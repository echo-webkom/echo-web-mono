import { sessions } from "@echo-webkom/db/schemas";
import { db } from "@echo-webkom/db/serverless";
import { eq } from "drizzle-orm";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { cache } from "react";

import { unoWithAdmin } from "@/api/server";
import { UnoClient } from "@/api/uno/client";

const rawSecret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;

if (!rawSecret) {
  console.error("AUTH_SECRET environment variable is not set");
}

const secret = new TextEncoder().encode(rawSecret);

export const SESSION_COOKIE_NAME = "session-token";

export async function getSessionToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
}

async function getSessionCookie(): Promise<string | null> {
  const cookieStore = await cookies();

  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(sessionCookie, secret);
    return payload.sessionId as string;
  } catch {
    return null;
  }
}

async function validateSession(sessionId: string) {
  const session = await db.query.sessions.findFirst({
    where: (session) => eq(session.sessionToken, sessionId),
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
    .sign(secret);
}

export async function signOut() {
  const cookieStore = await cookies();
  const sessionToken = await getSessionToken();

  if (!sessionToken) {
    return;
  }

  try {
    const unoClient = new UnoClient({
      baseUrl: process.env.NEXT_PUBLIC_API_URL,
      token: sessionToken,
    });
    // Sign out from uno with the users session token to invalidate it on the server side
    await unoClient.auth.signOut();
  } catch (error) {
    console.error("Failed to sign out from uno:", error);
    // Fall back to DB deletion if API call fails
    const sessionId = await getSessionCookie();
    if (sessionId) {
      await db.delete(sessions).where(eq(sessions.sessionToken, sessionId));
    }
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}

export type AuthSessionUser = Awaited<ReturnType<typeof auth>>;

export const auth = cache(async () => {
  const sessionId = await getSessionCookie();

  if (!sessionId) {
    return null;
  }

  const session = await validateSession(sessionId);

  if (!session) {
    return null;
  }

  try {
    return await unoWithAdmin.users.byId(session.userId);
  } catch {
    return null;
  }
});
