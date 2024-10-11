import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

import adminApp from "./services/admin.ts";
import degreesApp from "./services/degrees.ts";
import feedbackApp from "./services/feedback.ts";
import happeningApp from "./services/happening.ts";
import healthApp from "./services/health.ts";
import shoppingApp from "./services/shopping-list.ts";

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

app.route("/", healthApp);
app.route("/", adminApp);
app.route("/", happeningApp);
app.route("/", feedbackApp);
app.route("/", shoppingApp);
app.route("/", degreesApp);

export default app;
