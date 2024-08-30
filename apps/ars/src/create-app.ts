import { Hono } from "hono";

export type Bindings = {};

export const createApp = () => {
  const app = new Hono<{
    Bindings: Bindings;
  }>();

  return app;
};
