"use server";

import { and, eq, gt } from "drizzle-orm";

import { users, verificationTokens } from "@echo-webkom/db/schemas";
import { db } from "@echo-webkom/db/serverless";

export async function verifyEmail(token: string) {
  try {
    if (!token) {
      return {
        success: false,
        message: "Token er påkrevd",
      };
    }

    // Find the verification token
    const verificationToken = await db
      .select()
      .from(verificationTokens)
      .where(and(eq(verificationTokens.token, token), gt(verificationTokens.expires, new Date())))
      .then((res) => res[0] ?? null);

    if (!verificationToken) {
      return {
        success: false,
        message: "Ugyldig eller utløpt token",
      };
    }

    // Delete the verification token after successful verification
    await db.delete(verificationTokens).where(eq(verificationTokens.token, token));

    await db
      .update(users)
      .set({
        alternativeEmailVerifiedAt: new Date(),
      })
      .where(eq(users.alternativeEmail, verificationToken.identifier));

    return {
      success: true,
      message: "E-postadresse er bekreftet",
      email: verificationToken.identifier,
    };
  } catch (error) {
    console.error("Email verification error:", error);
    return {
      success: false,
      message: "En feil oppstod under bekreftelse",
    };
  }
}
