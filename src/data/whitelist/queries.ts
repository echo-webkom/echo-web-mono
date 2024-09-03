import { isFuture } from "date-fns";

import { db } from "@/db/drizzle";

export const getWhitelist = async () => {
  return await db.query.whitelist
    .findMany()
    .then((res) =>
      res.sort((a, b) => new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime()),
    )
    .then((res) => res.filter((row) => isFuture(row.expiresAt)));
};
