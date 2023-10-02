import { type Hono } from "hono";
import { jwt } from "hono/jwt";

import { handleCreateAccount, handleLogin, handleSignOut } from "./handlers/auth";
import { handleGetHappening, handleGetHappenings } from "./handlers/happening";
import { handleGetSelf, handleGetSelfRegistrations, handleUpdateSelf } from "./handlers/me";
import {
  handleGetRegistrations,
  handleRegistration,
  handleUnregister,
} from "./handlers/registration";
import { handleSyncSanity } from "./handlers/sanity";
import { handleGetHappeningSpotRanges } from "./handlers/spot-range";

const secret = process.env.JWT_SECRET!;
const jwtConfig = { secret, cookie: "user" };

export class RouteFactory {
  private app: Hono;

  constructor(app: Hono) {
    this.app = app;
  }

  configureRoutes() {
    this.configureRootRoute();
    this.configureHappeningRoutes();
    this.configureAdminRoutes();
    this.configureAuthRoutes();
    this.configureMeRoutes();
    this.configureSanityRoutes();
  }

  private configureRootRoute() {
    this.app.get("/", (c) => {
      return c.text("Hello, world!");
    });
  }

  private configureHappeningRoutes() {
    const happeningsRouter = this.app.basePath("/happenings");

    happeningsRouter.get("/", handleGetHappenings);

    const happeningRouter = this.app.basePath("/happening");
    happeningRouter.get("/:slug", handleGetHappening);
    happeningRouter.get("/:slug/registrations", jwt(jwtConfig), handleGetRegistrations);
    happeningRouter.post("/:slug/register", jwt(jwtConfig), handleRegistration);
    happeningRouter.post("/:slug/unregister", jwt(jwtConfig), handleUnregister);
    happeningRouter.get("/:slug/spot-ranges", jwt(jwtConfig), handleGetHappeningSpotRanges);
  }

  private configureAdminRoutes() {
    const adminRouter = this.app.basePath("/admin");

    adminRouter.get("/happenings", handleGetHappenings);
  }

  private configureAuthRoutes() {
    const authRouter = this.app.basePath("/auth");

    authRouter.post("/sign-up", handleCreateAccount);
    authRouter.post("/sign-in", handleLogin);
    authRouter.post("/sign-out", handleSignOut);
  }

  private configureMeRoutes() {
    const meRouter = this.app.basePath("/me");

    meRouter.get("/", jwt(jwtConfig), handleGetSelf);
    meRouter.patch("/", jwt(jwtConfig), handleUpdateSelf);
    meRouter.get("/registrations", jwt(jwtConfig), handleGetSelfRegistrations);
  }

  private configureSanityRoutes() {
    const sanityRouter = this.app.basePath("/sanity");

    sanityRouter.get("/", handleSyncSanity);
  }
}
