import { Hono } from "hono";

export type Bindings = {
  ADMIN_KEY: string;
};

export const createApp = () => {
  const app = new Hono<{
    Bindings: Bindings;
  }>();

  return app;
};
