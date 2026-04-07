"use server";

import { insertUserSchema } from "@echo-webkom/db/schemas";
import { z } from "zod";

import { UnoClient } from "@/api/uno/client";
import { auth, getSessionToken } from "@/auth/session";
import { sendVerificationEmail } from "@/lib/email-verification";
import { checkRateLimit } from "@/lib/rate-limit";

const updateSelfPayloadSchema = insertUserSchema.pick({
  alternativeEmail: true,
  degreeId: true,
  year: true,
  hasReadTerms: true,
  birthday: true,
  isPublic: true,
});

export const updateSelf = async (payload: z.infer<typeof updateSelfPayloadSchema>) => {
  try {
    const user = await auth();

    if (!user) {
      return {
        success: false,
        message: "Du er ikke logget inn",
      };
    }

    const data = updateSelfPayloadSchema.parse(payload);

    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const newAlternativeEmail = data.alternativeEmail?.trim() || null;
    const isEmailChanging = user?.alternativeEmail !== newAlternativeEmail;

    // Send verification email if alternativeEmail was updated and is not null
    // This must happen BEFORE the API call since it needs the old email data
    if (isEmailChanging && newAlternativeEmail) {
      // Rate limit: 3 attempts per hour per user
      const rateLimit = await checkRateLimit({
        key: `email-update-verification:${user.id}`,
        maxAttempts: 3,
        windowSeconds: 60 * 60, // 1 hour
      });

      if (!rateLimit.success) {
        const minutesUntilReset = Math.ceil(
          (rateLimit.resetAt.getTime() - Date.now()) / (1000 * 60),
        );
        return {
          success: false,
          message: `For mange forsøk på å endre e-post. Prøv igjen om ${minutesUntilReset} ${minutesUntilReset === 1 ? "minutt" : "minutter"}`,
        };
      }

      try {
        await sendVerificationEmail(newAlternativeEmail, user.name?.split(" ")[0]);
      } catch (emailError) {
        // Log the error but don't fail the entire operation
        console.error("Failed to send verification email:", emailError);
      }
    }

    // Create a client with the user's session token for the API call
    const sessionToken = await getSessionToken();
    if (!sessionToken) {
      return {
        success: false,
        message: "Noe gikk galt",
      };
    }

    const unoClient = new UnoClient({
      baseUrl: process.env.NEXT_PUBLIC_API_URL,
      token: sessionToken,
    });

    const response = await unoClient.users.update(user.id, {
      alternativeEmail: newAlternativeEmail,
      degreeId: data.degreeId,
      year: data.year,
      hasReadTerms: data.hasReadTerms,
      birthday: data.birthday,
      isPublic: data.isPublic,
    });

    if (!response.success) {
      return {
        success: false,
        message: "Fikk ikke til å oppdatere brukeren",
      };
    }

    return {
      success: true,
      message: "Brukeren ble oppdatert",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Tilbakemeldingen er ikke i riktig format",
      };
    }

    return {
      success: false,
      message: "En feil har oppstått",
    };
  }
};
