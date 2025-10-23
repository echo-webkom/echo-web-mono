import { serve } from "@hono/node-server";

import app from "./app";

const isGitHubCI = !!process.env.GITHUB_ACTIONS;
const HOSTNAME = isGitHubCI ? "localhost" : "0.0.0.0";
const PORT = process.env.API_PORT ? Number(process.env.API_PORT) : 8000;

serve(
  {
    fetch: app.fetch,
    port: PORT,
    hostname: HOSTNAME,
  },
  (info) => {
    // eslint-disable-next-line no-console
    console.log(`Listening on http://${HOSTNAME}:${info.port}`);
  },
);
