import { sql } from "drizzle-orm";

import { db } from "@echo-webkom/storage";

export async function getDatabaseStatus() {
  try {
    const resp = await db.execute(sql`SELECT 1`);
    return !!resp;
  } catch (e) {
    return false;
  }
}
