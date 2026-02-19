"use server";

import { cookies } from "next/headers";
import { addDays } from "date-fns";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

import { sessions, users } from "@echo-webkom/db/schemas";
import { db } from "@echo-webkom/db/serverless";

import { createSessionCookie, SESSION_COOKIE_NAME } from "@/auth/session";
import { IS_DEVTOOLS_ENABLED } from "@/config";

type DevtoolsLoginResult =
  | { success: true; message: string }
  | { success: false; error: string };

export async function devtoolsLogin(userId: string): Promise<DevtoolsLoginResult> {
  if (!IS_DEVTOOLS_ENABLED) {
    return {
      success: false,
      error: "Devtools er ikke aktivert.",
    };
  }

  if (!userId) {
    return {
      success: false,
      error: "Bruker-ID er påkrevd.",
    };
  }

  const user = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.id, userId),
  });

  if (!user) {
    return {
      success: false,
      error: "Bruker finnes ikke i databasen.",
    };
  }

  await db.update(users).set({ lastSignInAt: new Date() }).where(eq(users.id, user.id));

  let existingSession = await db.query.sessions.findFirst({
    where: (row, { eq, and, gt }) => and(eq(row.userId, user.id), gt(row.expires, new Date())),
  });

  if (!existingSession) {
    const sessionId = nanoid(40);
    const expiresAt = addDays(new Date(), 30);
    await db.insert(sessions).values({
      sessionToken: sessionId,
      userId: user.id,
      expires: expiresAt,
    });
    existingSession = {
      sessionToken: sessionId,
      expires: expiresAt,
      userId: user.id,
    };
  }

  const cookieStore = await cookies();
  const sessionCookie = await createSessionCookie(existingSession.sessionToken);

  cookieStore.set(SESSION_COOKIE_NAME, sessionCookie, {
    path: "/",
    expires: existingSession.expires,
    sameSite: "lax",
    secure: false,
  });

  return {
    success: true,
    message: "Innlogging vellykket!",
  };
}
