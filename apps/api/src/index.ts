import { serve } from "@hono/node-server";

import app from "./app";
import { HOSTNAME, PORT } from "./constants";

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
