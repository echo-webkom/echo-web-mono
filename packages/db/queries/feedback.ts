import {prisma} from "../client";

export const getAllFeedback = async () => {
  return await prisma.siteFeedback.findMany();
};
