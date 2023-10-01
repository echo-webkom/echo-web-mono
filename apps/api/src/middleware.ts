import { type Hono } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

export class MiddlewareFactory {
  private app;

  constructor(app: Hono) {
    this.app = app;
  }

  configureMiddleware() {
    this.configureCors();
    this.configureLogger();
    this.configureAdminAuth();
  }

  private configureAdminAuth() {
    const apiKey = process.env.API_KEY;

    if (apiKey) {
      this.app.use("/admin/*", bearerAuth({ token: apiKey }));
    }
  }

  private configureLogger() {
    this.app.use("*", logger());
  }

  private configureCors() {
    this.app.use(
      "*",
      cors({
        origin: ["http://localhost:3000"],
        allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowHeaders: ["Content-Type", "Authorization"],
        credentials: true,
      }),
    );
  }
}
