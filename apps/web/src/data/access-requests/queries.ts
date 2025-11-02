import { type AccessRequest } from "@echo-webkom/db/schemas";

import { apiServer } from "@/api/server";

export const getAccessRequests = async () => {
  return await apiServer.get("access-requests").json<Array<AccessRequest>>();
};
