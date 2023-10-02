/* eslint-disable no-console */
import React from "react";
import { render } from "@react-email/render";
import chalk from "chalk";

import { resend } from "./resend";
import UnregisterEmail from "./templates/unregister-email";

export const sendUnregisterEmail = (to: string, subject: string, _content: string) => {
  const html = render(<UnregisterEmail />, {
    pretty: true,
  });

  if (process.env.NODE_ENV !== "production") {
    console.log(chalk.bgGreen.black("Sending mock unregister email"));
    console.log(chalk.bgGreen.black("To: " + to));
    console.log(chalk.bgGreen.black("Subject: " + subject));
    console.log(chalk.bgGreen.black("Content: " + html));
    return;
  }

  void resend.sendEmail({
    from: "ikkesvar@echo-webkom.no",
    to,
    subject,
    html,
  });
};
