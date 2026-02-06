import { type Question } from "@echo-webkom/db/schemas";

import { apiServer } from "@/api/server";

export const getQuestionsByHappeningId = async (happeningId: string) => {
  return await apiServer.get(`happenings/${happeningId}/questions`).json<Array<Question>>();
};
