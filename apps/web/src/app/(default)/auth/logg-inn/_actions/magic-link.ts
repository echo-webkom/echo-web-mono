"use server";

import crypto from "crypto";
import { eq } from "drizzle-orm";

import { verificationTokens } from "@echo-webkom/db/schemas";
import { db } from "@echo-webkom/db/serverless";
import { MagicLinkEmail } from "@echo-webkom/email";
import { emailClient } from "@echo-webkom/email/client";

import { BASE_URL, DEV } from "@/config";
import { checkRateLimit } from "@/lib/rate-limit";
import { isValidEmail } from "@/utils/string";

type MagicLinkResult = { success: true; message: string } | { success: false; error: string };

const EXPIRY_MINUTES = 5;

export async function sendMagicLink(email: string): Promise<MagicLinkResult> {
  try {
    if (!email || !isValidEmail(email)) {
      return {
        success: false,
        error: "Ugyldig e-postadresse",
      };
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Rate limit: 3 attempts per 15 minutes per email
    const rateLimit = await checkRateLimit({
      key: `magic-link:${normalizedEmail}`,
      maxAttempts: 3,
      windowSeconds: 15 * 60, // 15 minutes
    });

    if (!rateLimit.success) {
      const minutesUntilReset = Math.ceil((rateLimit.resetAt.getTime() - Date.now()) / (1000 * 60));
      return {
        success: false,
        error: `For mange forsøk. Prøv igjen om ${minutesUntilReset} ${minutesUntilReset === 1 ? "minutt" : "minutter"}`,
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

    // Determine which email to send to and validate
    let targetEmail: string;

    if (existingUser.email.toLowerCase() === normalizedEmail) {
      targetEmail = existingUser.email;
    } else if (existingUser.alternativeEmail?.toLowerCase() === normalizedEmail) {
      if (!existingUser.alternativeEmailVerifiedAt) {
        return {
          success: false,
          error:
            "Den alternative e-postadressen må bekreftes før den kan brukes til innlogging. Sjekk din innboks for verifiseringsepost, eller logg inn med hoved-e-posten din.",
        };
      }
      targetEmail = existingUser.alternativeEmail;
    } else {
      // Should never happen
      return {
        success: false,
        error: "En feil oppstod. Vennligst prøv igjen.",
      };
    }

    const token = crypto.randomBytes(32).toString("hex");
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + EXPIRY_MINUTES * 60 * 1000);
    await db.delete(verificationTokens).where(eq(verificationTokens.identifier, targetEmail));
    await db.insert(verificationTokens).values({
      identifier: targetEmail,
      token,
      code,
      expires,
      used: false,
    });

    const magicLinkUrl = `${BASE_URL}/api/auth/magic-link/verify?token=${token}&email=${encodeURIComponent(targetEmail)}`;

    // Console log magic link in development
    if (DEV) {
      // eslint-disable-next-line no-console
      console.log("================================");
      // eslint-disable-next-line no-console
      console.log("Development mode - magic link URL:");
      // eslint-disable-next-line no-console
      console.log(`Magic link URL for ${targetEmail}: ${magicLinkUrl}`);
      // eslint-disable-next-line no-console
      console.log(`Login code: ${code}`);
      // eslint-disable-next-line no-console
      console.log("================================");
    }

    await emailClient.sendEmail(
      [targetEmail],
      "Logg inn på echo",
      MagicLinkEmail({
        magicLinkUrl,
        code,
        firstName: existingUser.name?.split(" ")[0] ?? "der",
      }),
    );

    return {
      success: true,
      message: `Magic link sendt til ${targetEmail}. Sjekk innboksen din for å logge inn.`,
    };
  } catch {
    return {
      success: false,
      error: "En feil oppstod. Prøv igjen senere.",
    };
  }
}
