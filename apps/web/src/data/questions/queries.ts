import { unoWithAdmin } from "@/api/server";

export const getQuestionsByHappeningId = async (happeningId: string) => {
  return await unoWithAdmin.happenings.questions(happeningId);
};
