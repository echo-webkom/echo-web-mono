import { serve } from "@hono/node-server";

import app from "./app";

const isCI = !!process.env.CI;
const HOSTNAME = isCI ? "localhost" : "0.0.0.0";
const PORT = process.env.API_PORT ? Number(process.env.API_PORT) : 8000;

serve(
  {
    fetch: app.fetch,
    port: PORT,
    hostname: HOSTNAME,
  },
  (info) => {
    console.log(`Listening on http://${HOSTNAME}:${info.port}`);
  },
);
