import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";

const app = new Hono();

app.use(logger());
app.use(cors());

app.get("/", (c) => {
  return c.text("OK");
});

export default app;
