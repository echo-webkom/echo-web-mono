import { Hono } from "hono";

import { admin } from "../middleware/admin";

export const createApp = () => {
  const publicApp = new Hono();
  const privateApp = new Hono();

  privateApp.use(admin());

  return {
    public: publicApp,
    private: privateApp,
  };
};

export const route = (path: string, app: Hono, ppApp: ReturnType<typeof createApp>) => {
  app.route(path, ppApp.public);
  app.route(path, ppApp.private);
};
