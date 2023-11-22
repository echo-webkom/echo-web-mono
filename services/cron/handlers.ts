import { pg } from "./pg.ts";

export const handleDeleteSensitiveQuestions = async () => {
  await pg.connect();
  const result = await pg
    .queryArray`DELETE FROM questions WHERE is_sensitive = true`;
  console.log(`Deleted ${result.rowCount} sensitive questions`);
  await pg.end();
};

export const handleDeleteOldStrikes = async () => {
  await pg.connect();
  const result = await pg
    .queryArray`DELETE FROM strike_info WHERE created_at < NOW() - INTERVAL '1 year'`;
  console.log(`Deleted ${result.rowCount} old strikes`);
  await pg.end();
};

export const handleResetYear = async () => {
  await pg.connect();
  const result = await pg.queryArray`UPDATE "user" SET year = null`;
  console.log(`Updated the year of ${result.rowCount} users`);
  await pg.end();
};
