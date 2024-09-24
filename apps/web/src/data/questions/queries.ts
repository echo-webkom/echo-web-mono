import { type Question } from "@echo-webkom/db/schemas";

import { apiServer } from "@/api/server";

export const getQuestionsByHappeningId = async (happeningId: string) => {
  return await apiServer.get(`happening/${happeningId}/questions`).json<Array<Question>>();
};
