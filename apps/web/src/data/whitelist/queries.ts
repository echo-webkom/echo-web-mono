import { db } from "@echo-webkom/db";

export const getWhitelist = async () => {
  return await db.query.whitelist.findMany();
};
