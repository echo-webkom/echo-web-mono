"use server";

/* eslint-disable no-console */
import { render } from "@echo-webkom/email";

const apiKey = process.env.RESEND_API_KEY!;

const FROM_EMAIL = "echo <ikkesvar@echo-webkom.no>";

export async function sendEmail(to: Array<string>, subject: string, Email: React.ReactElement) {
  const html = await render(Email);

  if (process.env.NODE_ENV === "development" || !apiKey) {
    console.log("SENDING EMAIL");
    console.log("TO:", to);
    console.log("SUBJECT:", subject);
    console.log("EMAIL", html);
    return;
  }

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    }),
  });
}
