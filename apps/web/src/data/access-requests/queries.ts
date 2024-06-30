import { db } from "@echo-webkom/db";

export const getAccessRequests = async () => {
  return await db.query.accessRequests.findMany();
};
