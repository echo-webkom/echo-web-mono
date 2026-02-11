import { type SiteFeedback } from "@echo-webkom/db/schemas";

import { apiServer } from "@/api/server";

export const getAllFeedback = async () => {
  return await apiServer.get("feedbacks").json<Array<SiteFeedback>>();
};

export const getFeedbackById = async (id: string) => {
  return await apiServer.get(`feedbacks/${id}`).json<SiteFeedback>();
};
