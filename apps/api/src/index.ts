import { serve } from "@hono/node-server";

import app from "./app";

const PORT = process.env.API_PORT ? Number(process.env.API_PORT) : 8000;

serve(
  {
    fetch: app.fetch,
    port: PORT,
    hostname: "127.0.0.1",
  },
  (info) => {
    console.log(`Listening on http://localhost:${info.port}`);
  },
);
