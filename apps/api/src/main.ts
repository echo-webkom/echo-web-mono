import "dotenv/config";

import { serve } from "@hono/node-server";
import chalk from "chalk";

import { app } from "./app";

const PORT = 3003;

serve({
  fetch: app.fetch,
  port: PORT,
});

console.log(chalk.bgBlue.black(`🚀 Server listening on port ${PORT}`));
