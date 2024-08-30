/* eslint-disable no-console */
import "server-only";

import { render } from "jsx-email";

const API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = "echo <ikkesvar@echo-webkom.no>";

export const emailClient = {
  /**
   * Only sends an email if the NODE_ENV is production and if the RESEND_API_KEY is set
   * else
   * It logs the email to the console
   *
   * @param to the people that should recieve the email
   * @param subject  the subject of the email
   * @param Email the email component to render
   */
  sendEmail: async (to: Array<string>, subject: string, component: React.ReactElement) => {
    const html = await render(component);

    if (process.env.NODE_ENV !== "production" || !API_KEY) {
      console.log("SENDING EMAIL");
      console.log("TO:", to);
      console.log("SUBJECT:", subject);
      console.log("EMAIL", html);
      return;
    }

    if (!API_KEY) {
      throw new Error("Missing RESEND_API_KEY");
    }

    return await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to,
        subject,
        html,
      }),
    });
  },
};
