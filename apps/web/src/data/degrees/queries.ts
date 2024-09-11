import { type Degree } from "@echo-webkom/db/schemas";

import { apiClient } from "@/api/client";

export const getAllDegrees = async () => {
  return await apiClient.get("degrees").json<Array<Degree>>();
};
