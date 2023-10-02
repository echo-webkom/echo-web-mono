import { type Hono } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";

export class MiddlewareFactory {
  private app;

  constructor(app: Hono) {
    this.app = app;
  }

  configureMiddleware() {
    this.configureCors();
    this.configureLogger();
    this.configureAdminAuth();
    this.configureSecureHeaders();
  }

  private configureAdminAuth() {
    const apiKey = process.env.API_KEY;

    if (apiKey) {
      this.app.use("/admin/*", bearerAuth({ token: apiKey }));
      this.app.use("/sanity/*", bearerAuth({ token: apiKey }));
    }
  }

  private configureLogger() {
    this.app.use("*", logger());
  }

  private configureSecureHeaders() {
    this.app.use("*", secureHeaders());
  }

  private configureCors() {
    this.app.use(
      "*",
      cors({
        origin: ["http://localhost:3000"],
        allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowHeaders: ["Content-Type", "Authorization"],
        credentials: true,
      }),
    );
  }
}
