import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

import adminApp from "./services/admin";
import authApp from "./services/auth";
import degreesApp from "./services/degrees";
import feedbackApp from "./services/feedback";
import happeningApp from "./services/happening";
import healthApp from "./services/health";
import shoppingApp from "./services/shopping-list";
import userApp from "./services/user";

const app = new Hono();

app.use(logger());
app.use(
  cors({
    origin: ["http://localhost:3000", "https://echo.uib.no"],
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);

[adminApp, authApp, degreesApp, feedbackApp, happeningApp, healthApp, shoppingApp, userApp].forEach(
  (a) => {
    app.route("/", a);
  },
);

export default app;
