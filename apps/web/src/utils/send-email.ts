"use server";

/* eslint-disable no-console */
import { render } from "@echo-webkom/email";

import { resend } from "./resend";

/**
 * Only sends an email if the NODE_ENV is development or if the RESEND_API_KEY is not set
 *
 * @param to the people that should recieve the email
 * @param subject  the subject of the email
 * @param Email the email component to render
 */
export async function sendEmail(to: Array<string>, subject: string, Email: React.ReactElement) {
  const html = await render(Email);

  if (process.env.NODE_ENV === "development" || !process.env.RESEND_API_KEY) {
    console.log("SENDING EMAIL");
    console.log("TO:", to);
    console.log("SUBJECT:", subject);
    console.log("EMAIL", html);
    return;
  }

  await resend.sendEmail(to, subject, html);
}
