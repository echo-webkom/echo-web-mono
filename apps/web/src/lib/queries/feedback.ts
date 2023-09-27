import { prisma } from "@echo-webkom/db";

export async function getAllFeedback() {
  return await prisma.siteFeedback.findMany();
}
