import { unoWithAdmin } from "@/api/server";

export const getAllFeedback = async () => {
  return await unoWithAdmin.siteFeedbacks.all();
};

export const getFeedbackById = async (id: string) => {
  return await unoWithAdmin.siteFeedbacks.getById(id);
};
