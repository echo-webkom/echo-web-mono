import { type SpotRange } from "@echo-webkom/db/schemas";

import { apiServer } from "@/api/server";

export const getSpotRangeByHappeningId = async (happeningId: string) => {
  return await apiServer.get(`happening/${happeningId}/spot-ranges`).json<Array<SpotRange>>();
};
