import "server-only";

const EMAIL_BASE_URL = process.env.EMAIL_BASE_URL;

async function post(path: string, body: unknown): Promise<void> {
  if (!EMAIL_BASE_URL) return;

  const res = await fetch(`${EMAIL_BASE_URL}/send/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`Email service error: ${res.status} ${res.statusText}`);
  }
}

export const emailClient = {
  sendEmailVerification: (
    to: Array<string>,
    subject: string,
    verificationUrl: string,
    firstName?: string,
  ) => post("email-verification", { to, subject, verificationUrl, firstName }),

  sendMagicLink: (
    to: Array<string>,
    subject: string,
    magicLinkUrl: string,
    code: string,
    firstName?: string,
  ) => post("magic-link", { to, subject, magicLinkUrl, code, firstName }),
};
