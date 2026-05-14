import { serve } from "@hono/node-server";

import { app } from "./routes";

const PORT = Number(process.env.EMAIL_PORT) || 6000;

serve({ fetch: app.fetch, port: PORT }, () => {
  // oxlint-disable-next-line no-console
  console.log(`Email service running on http://localhost:${PORT}`);
});
