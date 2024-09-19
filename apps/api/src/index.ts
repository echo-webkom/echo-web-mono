import { serve } from "@hono/node-server";

import app from "./app";

const PORT = 8000;

serve(
  {
    fetch: app.fetch,
    port: PORT,
  },
  (info) => {
    console.log(`Listening on http://localhost:${info.port}`);
  },
);
