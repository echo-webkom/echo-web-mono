import { db } from "@/db/drizzle";

export const getAccessRequests = async () => {
  return await db.query.accessRequests.findMany();
};
