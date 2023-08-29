import { prisma } from "@echo-webkom/db";

export const getAllFeedback = async () => {
  return await prisma.siteFeedback.findMany();
};
