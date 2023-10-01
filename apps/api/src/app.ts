import { Hono } from "hono";
import { MiddlewareFactory } from "./middleware";
import { RouteFactory } from "./routes";

export const app = new Hono();

// Setup routes and middleware
const mf = new MiddlewareFactory(app);
const rf = new RouteFactory(app);
mf.configureMiddleware();
rf.configureRoutes();
