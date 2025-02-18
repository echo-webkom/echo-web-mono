import { serve } from "@hono/node-server";
import { createNodeWebSocket } from "@hono/node-ws";
import { WSContext } from "hono/ws";

import app from "./app";

const isCI = !!process.env.CI;
const HOSTNAME = isCI ? "localhost" : "0.0.0.0";
const PORT = process.env.API_PORT ? Number(process.env.API_PORT) : 8000;

const { upgradeWebSocket, injectWebSocket } = createNodeWebSocket({ app });

let users = new Set<WSContext<WebSocket>>();

app.get("/active-users", (c) => {
  console.log("Active users requested");
  console.log(users.size);

  return c.json({ count: users.size });
});

const broadcastActiveUsers = () => {
  for (const ws of users) {
    ws.send(JSON.stringify({ count: users.size }));
  }
};

app.get(
  "/ws/active-users",
  upgradeWebSocket(() => {
    return {
      onOpen: (_, ws) => {
        users.add(ws);
        broadcastActiveUsers();
      },
      onClose: (_, ws) => {
        users.delete(ws);
        broadcastActiveUsers();
      },
    };
  }),
);

const server = serve(
  {
    fetch: app.fetch,
    port: PORT,
    hostname: HOSTNAME,
  },
  (info) => {
    console.log(`Listening on http://${HOSTNAME}:${info.port}`);
  },
);
injectWebSocket(server);
