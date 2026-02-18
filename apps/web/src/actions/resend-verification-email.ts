"use server";

import { auth } from "@/auth/session";
import { sendVerificationEmail } from "@/lib/email-verification";
import { checkRateLimit } from "@/lib/rate-limit";

type ResendVerificationEmailResult =
  | { success: true; message: string }
  | { success: false; error: string };

/**
 * Resend verification email to the user's alternative email address.
 * Rate limited to 3 attempts per hour per user.
 */
export async function resendVerificationEmail(): Promise<ResendVerificationEmailResult> {
  try {
    const user = await auth();

    if (!user) {
      return {
        success: false,
        error: "Du må være logget inn",
      };
    }

    if (!user.alternativeEmail) {
      return {
        success: false,
        error: "Du har ingen alternativ e-post registrert",
      };
    }

    if (user.alternativeEmailVerifiedAt) {
      return {
        success: false,
        error: "E-posten din er allerede bekreftet",
      };
    }

    // Rate limit: 3 attempts per hour per user
    const rateLimit = await checkRateLimit({
      key: `resend-verification:${user.id}`,
      maxAttempts: 3,
      windowSeconds: 60 * 60, // 1 hour
    });

    if (!rateLimit.success) {
      const minutesUntilReset = Math.ceil((rateLimit.resetAt.getTime() - Date.now()) / (1000 * 60));
      return {
        success: false,
        error: `For mange forsøk. Prøv igjen om ${minutesUntilReset} ${minutesUntilReset === 1 ? "minutt" : "minutter"}`,
      };
    }

    // Send verification email
    const firstName = user.name?.split(" ")[0];
    await sendVerificationEmail(user.alternativeEmail, firstName);

    return {
      success: true,
      message: `Verifiseringsepost sendt til ${user.alternativeEmail}`,
    };
  } catch (error) {
    console.error("Error resending verification email:", error);
    return {
      success: false,
      error: "En feil oppstod. Prøv igjen senere.",
    };
  }
}
