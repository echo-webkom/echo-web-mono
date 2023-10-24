import { db } from "@echo-webkom/db";

export async function getAllFeedback() {
  return await db.query.siteFeedback.findMany();
}
