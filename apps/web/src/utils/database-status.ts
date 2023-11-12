import { cache } from "react";
import { sql } from "drizzle-orm";

import { db } from "@echo-webkom/db";

export const revalidate = 120;

export const getDatabaseStatus = cache(async () => {
  try {
    const resp = await db.execute(sql`SELECT 1`);
    return resp.length === 1;
  } catch (e) {
    return false;
  }
});
