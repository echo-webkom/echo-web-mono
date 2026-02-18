/* eslint-disable no-console */
import "server-only";

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
      try {
        console.log("\n========== EMAIL SENT (DEV MODE) ==========");
        console.log("TO:", to.join(", "));
        console.log("SUBJECT:", subject);
        console.log("==========================================\n");
        return { success: true };
      } catch (error) {
        console.error("Error rendering email in dev mode:", error);
        throw error;
      }
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
