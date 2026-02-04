"use server";

import crypto from "crypto";
import { eq } from "drizzle-orm";

import { verificationTokens } from "@echo-webkom/db/schemas";
import { db } from "@echo-webkom/db/serverless";
import { MagicLinkEmail } from "@echo-webkom/email";
import { emailClient } from "@echo-webkom/email/client";

import { BASE_URL } from "@/config";
import { isValidEmail } from "@/utils/string";

type MagicLinkResult = { success: true; message: string } | { success: false; error: string };

export async function sendMagicLink(email: string): Promise<MagicLinkResult> {
  try {
    if (!email || !isValidEmail(email)) {
      return {
        success: false,
        error: "Ugyldig e-postadresse",
      };
    }

    // Check if user exists with this email or alternative email
    const existingUser = await db.query.users.findFirst({
      where: (user, { eq, or }) => or(eq(user.email, email), eq(user.alternativeEmail, email)),
    });

    if (!existingUser) {
      return {
        success: false,
        error:
          "Ingen bruker funnet med denne e-postadressen. Du må være medlem av echo for å logge inn.",
      };
    }

    // Generate secure token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Delete any existing tokens for this email
    await db.delete(verificationTokens).where(eq(verificationTokens.identifier, email));

    // Store the new token
    await db.insert(verificationTokens).values({
      identifier: email,
      token,
      expires,
    });

    // Generate magic link URL
    const magicLinkUrl = `${BASE_URL}/api/auth/magic-link/verify?token=${token}&email=${encodeURIComponent(email)}`;

    // Send email
    await emailClient.sendEmail(
      [email],
      "Logg inn på echo",
      MagicLinkEmail({
        magicLinkUrl,
        firstName: existingUser.name?.split(" ")[0] ?? "der",
      }),
    );

    return {
      success: true,
      message: "Magic link sendt! Sjekk din e-post for å logge inn.",
    };
  } catch {
    return {
      success: false,
      error: "En feil oppstod. Prøv igjen senere.",
    };
  }
}
