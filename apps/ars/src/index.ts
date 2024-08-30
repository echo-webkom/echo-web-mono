import "dotenv/config";

import { serve } from "@hono/node-server";

import app from "./app";

const PORT = 4444;
console.log(`Server is running on port ${PORT}`);

serve({
  fetch: app.fetch,
  port: PORT,
});
