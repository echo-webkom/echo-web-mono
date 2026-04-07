import { render } from "@react-email/render";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import * as React from "react";

import { sendEmail } from "./email";
import AccessDeniedEmail from "./emails/access-denied";
import AccessGrantedEmail from "./emails/access-granted";
import AccessRequestNotificationEmail from "./emails/access-request-notification";
import DeregistrationNotificationEmail from "./emails/deregistration-notification";
import EmailVerificationEmail from "./emails/email-verification";
import GotSpotNotificationEmail from "./emails/got-spot-notification";
import MagicLinkEmail from "./emails/magic-link";
import RegistrationConfirmationEmail from "./emails/registration-confirmation";
import StrikeNotificationEmail from "./emails/strike-notification";

const app = new Hono();

app.use(logger());
app.use(cors());

app.use("*", async (c, next) => {
  // Allow unauthenticated access to the root path for health checks
  if (c.req.path === "/") {
    await next();
  }
  // For all other paths, require authentication
  // Check if the Authorization header is present and matches the expected admin key
  const authHeader = c.req.header("Authorization");
  if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_KEY}`) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  await next();
});

app.get("/", (c) => c.json({ status: "ok" }));

app.post("/registration-confirmation", async (c) => {
  const { to, subject, title, isBedpres } = await c.req.json<{
    to: Array<string>;
    subject: string;
    title?: string;
    isBedpres?: boolean;
  }>();
  const html = await render(
    React.createElement(RegistrationConfirmationEmail, { title, isBedpres }),
  );
  await sendEmail(to, subject, html);
  return c.json({ success: true });
});

app.post("/deregistration-notification", async (c) => {
  const { to, subject, name, reason, happeningTitle } = await c.req.json<{
    to: Array<string>;
    subject: string;
    name?: string;
    reason?: string;
    happeningTitle?: string;
  }>();
  const html = await render(
    React.createElement(DeregistrationNotificationEmail, { name, reason, happeningTitle }),
  );
  await sendEmail(to, subject, html);
  return c.json({ success: true });
});

app.post("/got-spot-notification", async (c) => {
  const { to, subject, name, happeningTitle } = await c.req.json<{
    to: Array<string>;
    subject: string;
    name?: string;
    happeningTitle?: string;
  }>();
  const html = await render(
    React.createElement(GotSpotNotificationEmail, { name, happeningTitle }),
  );
  await sendEmail(to, subject, html);
  return c.json({ success: true });
});

app.post("/strike-notification", async (c) => {
  const { to, subject, name, reason, amount, isBanned } = await c.req.json<{
    to: Array<string>;
    subject: string;
    name?: string;
    reason?: string;
    amount?: number;
    isBanned?: boolean;
  }>();
  const html = await render(
    React.createElement(StrikeNotificationEmail, { name, reason, amount, isBanned }),
  );
  await sendEmail(to, subject, html);
  return c.json({ success: true });
});

app.post("/access-granted", async (c) => {
  const { to, subject } = await c.req.json<{
    to: Array<string>;
    subject: string;
  }>();
  const html = await render(React.createElement(AccessGrantedEmail));
  await sendEmail(to, subject, html);
  return c.json({ success: true });
});

app.post("/access-denied", async (c) => {
  const { to, subject, reason } = await c.req.json<{
    to: Array<string>;
    subject: string;
    reason?: string;
  }>();
  const html = await render(React.createElement(AccessDeniedEmail, { reason }));
  await sendEmail(to, subject, html);
  return c.json({ success: true });
});

app.post("/access-request-notification", async (c) => {
  const { to, subject, email, reason } = await c.req.json<{
    to: Array<string>;
    subject: string;
    email?: string;
    reason?: string;
  }>();
  const html = await render(React.createElement(AccessRequestNotificationEmail, { email, reason }));
  await sendEmail(to, subject, html);
  return c.json({ success: true });
});

app.post("/email-verification", async (c) => {
  const { to, subject, verificationUrl, firstName } = await c.req.json<{
    to: Array<string>;
    subject: string;
    verificationUrl: string;
    firstName?: string;
  }>();
  const html = await render(
    React.createElement(EmailVerificationEmail, { verificationUrl, firstName }),
  );
  await sendEmail(to, subject, html);
  return c.json({ success: true });
});

app.post("/magic-link", async (c) => {
  const { to, subject, magicLinkUrl, code, firstName } = await c.req.json<{
    to: Array<string>;
    subject: string;
    magicLinkUrl: string;
    code: string;
    firstName?: string;
  }>();
  const html = await render(React.createElement(MagicLinkEmail, { magicLinkUrl, code, firstName }));
  await sendEmail(to, subject, html);
  return c.json({ success: true });
});

export { app };
