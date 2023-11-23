import { runQuery } from "./pg.ts";

export const handleDeleteSensitiveQuestions = async () => {
  const result = await runQuery(
    "DELETE FROM questions WHERE is_sensitive = true",
  );
  console.log(`Deleted ${result.rowCount} sensitive questions`);
};

export const handleDeleteOldStrikes = async () => {
  const result = await runQuery(
    "DELETE FROM strike_info WHERE created_at < NOW() - INTERVAL '1 year'",
  );
  console.log(`Deleted ${result.rowCount} old strikes`);
};

export const handleResetYear = async () => {
  const result = await runQuery('UPDATE "user" SET year = null');
  console.log(`Reset ${result.rowCount} users' years`);
};
