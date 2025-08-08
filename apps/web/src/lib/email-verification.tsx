import { addHours } from "date-fns";
import { nanoid } from "nanoid";

import { verificationTokens } from "@echo-webkom/db/schemas";
import { db } from "@echo-webkom/db/serverless";
import { EmailVerificationEmail } from "@echo-webkom/email";
import { emailClient } from "@echo-webkom/email/client";

import { BASE_URL } from "@/config";

const TOKEN_EXPIRY_HOURS = 24;

export async function generateVerificationToken(email: string): Promise<string> {
  const token = nanoid();
  const expires = addHours(new Date(), TOKEN_EXPIRY_HOURS);

  await db.insert(verificationTokens).values({
    identifier: email,
    token,
    expires,
  });

  return token;
}

export function createVerificationUrl(token: string): string {
  return `${BASE_URL}/auth/bekreft-epost?token=${token}`;
}

export async function sendVerificationEmail(email: string, firstName?: string): Promise<void> {
  const token = await generateVerificationToken(email);
  const verificationUrl = createVerificationUrl(token);

  await emailClient.sendEmail(
    [email],
    "Bekreft e-postadressen din - echo",
    <EmailVerificationEmail verificationUrl={verificationUrl} firstName={firstName} />,
  );
}
