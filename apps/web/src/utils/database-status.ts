import { sql } from "drizzle-orm";

import { db } from "@echo-webkom/db";

export async function getDatabaseStatus() {
  try {
    const resp = await db.execute(sql`SELECT 1`);
    return resp.length === 1;
  } catch (e) {
    return false;
  }
}
