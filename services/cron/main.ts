import {
  handleDeleteOldStrikes,
  handleDeleteSensitiveQuestions,
  handleResetYear,
} from "./handlers.ts";

/**
 * Runs at 00:00 on the 1st of January and July
 */
Deno.cron(
  "delete sensitive data",
  "0 0 1 1,7 *",
  handleDeleteSensitiveQuestions,
);

/**
 * Runs at 00:00 on the 1st of January and July
 */
Deno.cron(
  "delete old strikes",
  "0 0 1 1,7 *",
  handleDeleteOldStrikes,
);

/**
 * Runs at 00:00 on the 1st of July
 */
Deno.cron(
  "reset user year",
  "0 0 1 7 *",
  handleResetYear,
);
