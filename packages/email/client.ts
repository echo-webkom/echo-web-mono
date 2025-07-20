/* eslint-disable no-console */
import "server-only";

import { render } from "@react-email/render";
import { Resend } from "resend";

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
    if (process.env.NODE_ENV !== "production" || !API_KEY) {
      const text = await render(component);

      console.log("SENDING EMAIL");
      console.log("TO:", to);
      console.log("SUBJECT:", subject);
      console.log("EMAIL", text);
      return;
    }

    const resend = new Resend(API_KEY);
    return await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      react: component,
    });
  },
};
