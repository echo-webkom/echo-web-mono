import { sql } from "drizzle-orm";

import {
  answers,
  db,
  happenings,
  passwords,
  questions,
  registrations,
  siteFeedbacks,
  spotRanges,
  users,
} from "@echo-webkom/storage";

const tables = [
  users,
  happenings,
  questions,
  answers,
  passwords,
  siteFeedbacks,
  registrations,
  spotRanges,
];

export const resetDb = async () => {
  for (const table of tables) {
    await db.execute(sql`TRUNCATE TABLE ${table}`);
  }
};
