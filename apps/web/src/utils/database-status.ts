import { unstable_cache as cache } from "next/cache";
import { sql } from "drizzle-orm";

import { db } from "@echo-webkom/db";

export const getDatabaseStatus = cache(
  async () => {
    try {
      const resp = await db.execute(sql`SELECT 1`);
      return resp.length === 1;
    } catch (e) {
      return false;
    }
  },
  undefined,
  {
    revalidate: 120,
  },
);
