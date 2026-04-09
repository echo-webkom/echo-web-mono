/* eslint-disable no-console */
import { Resend } from "resend";

const FROM_EMAIL = "echo <ikkesvar@echo-webkom.no>";
const IS_PROD = process.env.ENVIRONMENT?.startsWith("p") && !!process.env.RESEND_API_KEY;

export async function sendEmail(to: Array<string>, subject: string, html: string): Promise<void> {
  if (!IS_PROD) {
    console.log("\n========== EMAIL SENT (DEV MODE) ==========");
    console.log("TO:", to.join(", "));
    console.log("SUBJECT:", subject);
    console.log("==========================================\n");
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({ from: FROM_EMAIL, to, subject, html });
}
