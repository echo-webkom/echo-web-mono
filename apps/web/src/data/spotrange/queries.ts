import { unoWithAdmin } from "../../api/server";

export const getSpotRangeByHappeningId = async (happeningId: string) => {
  return await unoWithAdmin.happenings.spotRanges(happeningId);
};
