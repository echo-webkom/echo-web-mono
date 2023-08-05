import {prisma} from "@echo-webkom/db/client";

export const getAllFeedback = async () => {
  return await prisma.siteFeedback.findMany();
};
