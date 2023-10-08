import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";

import authService from "./services/auth";
import happeningService from "./services/happening";
import happeningsService from "./services/happenings";
import meService from "./services/me";
import sanityService from "./services/sanity";

export const app = new Hono();

app.use("*", logger());
app.use("*", secureHeaders());
app.use(
  "*",
  cors({
    origin: ["http://localhost:3000"],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

// Routes
app.get("/", (c) => {
  return c.text("Hello, world!");
});

app.route("/", authService);
app.route("/", happeningsService);
app.route("/", happeningService);
app.route("/", meService);
app.route("/", sanityService);
