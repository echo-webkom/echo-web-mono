import { Hono } from "hono";
import { getCookie } from "hono/cookie";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { jwtVerify } from "jose";

import adminApp from "./services/admin";
import birthdays from "./services/birthdays";
import degreesApp from "./services/degrees";
import feedbackApp from "./services/feedback";
import happeningApp from "./services/happening";
import healthApp from "./services/health";
import shoppingApp from "./services/shopping-list";
import strikesApp from "./services/strikes";

const app = new Hono();

app.use(logger());
app.use(
  cors({
    origin: [
      // Development domains
      "http://localhost:3000",
      "http://localhost:5173",
      // Production domains
      "https://echo.uib.no",
      "https://screen.echo-webkom.no",
    ],
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);

const secret = new TextEncoder().encode(process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET);

app.get("/whoami", async (c) => {
  const cookie = getCookie(c, "session-token");
  if (!cookie) {
    return c.json({ user: null });
  }

  try {
    const { payload } = await jwtVerify(cookie, secret);
    return c.json({ sessionId: payload.sessionId });
  } catch {
    return c.json({ user: null });
  }
});

app.route("/", healthApp);
app.route("/", adminApp);
app.route("/", happeningApp);
app.route("/", feedbackApp);
app.route("/", shoppingApp);
app.route("/", degreesApp);
app.route("/", birthdays);
app.route("/", strikesApp);

export default app;
