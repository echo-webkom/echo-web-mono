import { unstable_cache as cache } from "next/cache";

import { db } from "@echo-webkom/db";

export function getAllDegrees() {
  return cache(async () => {
    return await db.query.degrees.findMany();
  })();
}
