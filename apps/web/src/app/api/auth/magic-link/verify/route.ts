import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { addDays } from "date-fns";
import { and, eq } from "drizzle-orm";
import { nanoid } from "nanoid";

import { sessions, users, verificationTokens } from "@echo-webkom/db/schemas";
import { db } from "@echo-webkom/db/serverless";

import { createSessionCookie, SESSION_COOKIE_NAME } from "@/auth/session";
import { cleanupExpiredTokens } from "@/lib/cleanup-tokens";

export async function GET(request: NextRequest) {
  try {
    await cleanupExpiredTokens();

    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (!token || !email) {
      return NextResponse.redirect(new URL("/auth/logg-inn?error=invalid-token", request.url));
    }

    // Find and verify the token
    const verificationToken = await db.query.verificationTokens.findFirst({
      where: and(
        eq(verificationTokens.identifier, email),
        eq(verificationTokens.token, token),
        eq(verificationTokens.used, false),
      ),
    });

    if (!verificationToken) {
      return NextResponse.redirect(new URL("/auth/logg-inn?error=invalid-token", request.url));
    }

    // Check if expired
    if (verificationToken.expires < new Date()) {
      return NextResponse.redirect(new URL("/auth/logg-inn?error=expired-token", request.url));
    }

    const user = await db.query.users.findFirst({
      where: (user, { eq, or }) => or(eq(user.email, email), eq(user.alternativeEmail, email)),
    });

    if (!user) {
      return NextResponse.redirect(new URL("/auth/logg-inn?error=user-not-found", request.url));
    }

    // Check if email is verified
    if (user.alternativeEmail === email && !user.alternativeEmailVerifiedAt) {
      return NextResponse.redirect(
        new URL("/auth/logg-inn?error=unverified-alternative-email", request.url),
      );
    }

    // Mark the token as used instead of deleting it
    await db
      .update(verificationTokens)
      .set({ used: true })
      .where(and(eq(verificationTokens.identifier, email), eq(verificationTokens.token, token)));

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

    // Set session cookie
    const cookieStore = await cookies();
    const sessionCookie = await createSessionCookie(existingSession.sessionToken);

    cookieStore.set(SESSION_COOKIE_NAME, sessionCookie, {
      path: "/",
      expires: existingSession.expires,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    });

    return NextResponse.redirect(new URL("/", request.url));
  } catch (error) {
    console.error("Error verifying magic link:", error);
    return NextResponse.redirect(new URL("/auth/logg-inn?error=verification-failed", request.url));
  }
}
