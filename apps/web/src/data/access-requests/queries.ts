import { db } from "@echo-webkom/db/serverless";

export const getAccessRequests = async () => {
  return await db.query.accessRequests.findMany();
};
