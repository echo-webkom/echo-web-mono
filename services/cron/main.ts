import {
  handleDeleteOldStrikes,
  handleDeleteSensitiveQuestions,
  handleResetYear,
} from "./handlers.ts";

Deno.cron(
  "delete sensitive data",
  "0 0 1 1,7 *",
  handleDeleteSensitiveQuestions,
);

Deno.cron(
  "delete old strikes",
  "0 0 1 1,7 *",
  handleDeleteOldStrikes,
);

Deno.cron(
  "reset user year",
  "0 0 1 7 *",
  handleResetYear,
);
