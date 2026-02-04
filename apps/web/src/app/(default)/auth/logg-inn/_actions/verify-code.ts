"use server";

import { cookies } from "next/headers";
import { addDays } from "date-fns";
import { and, eq } from "drizzle-orm";
import { nanoid } from "nanoid";

import { sessions, users, verificationTokens } from "@echo-webkom/db/schemas";
import { db } from "@echo-webkom/db/serverless";

import { createSessionCookie, SESSION_COOKIE_NAME } from "@/auth/session";
import { cleanupExpiredTokens } from "@/lib/cleanup-tokens";
import { isValidEmail } from "@/utils/string";

type VerifyCodeResult = { success: true } | { success: false; error: string };

export async function verifyCode(email: string, code: string): Promise<VerifyCodeResult> {
  try {
    if (!email || !isValidEmail(email)) {
      return {
        success: false,
        error: "Ugyldig e-postadresse",
      };
    }

    if (code?.length !== 6 || !/^\d{6}$/.test(code)) {
      return {
        success: false,
        error: "Ugyldig kode. Koden må være 6 siffer.",
      };
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Clean up expired tokens
    await cleanupExpiredTokens();

    const verificationToken = await db.query.verificationTokens.findFirst({
      where: and(
        eq(verificationTokens.identifier, normalizedEmail),
        eq(verificationTokens.code, code),
        eq(verificationTokens.used, false),
      ),
    });

    if (!verificationToken) {
      return {
        success: false,
        error: "Ugyldig kode eller e-postadresse",
      };
    }

    // Check if expired
    if (verificationToken.expires < new Date()) {
      return {
        success: false,
        error: "Koden har utløpt. Vennligst be om en ny.",
      };
    }

    // Find the user
    const user = await db.query.users.findFirst({
      where: (user, { eq, or }) =>
        or(eq(user.email, normalizedEmail), eq(user.alternativeEmail, normalizedEmail)),
    });

    if (!user) {
      return {
        success: false,
        error: "Ingen bruker funnet med denne e-postadressen",
      };
    }

    // Check if email is verified
    if (user.alternativeEmail === normalizedEmail && !user.alternativeEmailVerifiedAt) {
      return {
        success: false,
        error:
          "Den alternative e-postadressen må bekreftes før den kan brukes til innlogging. Logg inn med hoved-e-posten din.",
      };
    }

    // Mark the token as used
    await db
      .update(verificationTokens)
      .set({ used: true })
      .where(
        and(eq(verificationTokens.identifier, normalizedEmail), eq(verificationTokens.code, code)),
      );

    // Update last sign in
    await db.update(users).set({ lastSignInAt: new Date() }).where(eq(users.id, user.id));

    // Create or reuse existing session
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
    });

    return { success: true };
  } catch (error) {
    console.error("Error verifying code:", error);
    return {
      success: false,
      error: "En feil oppstod. Vennligst prøv igjen.",
    };
  }
}
