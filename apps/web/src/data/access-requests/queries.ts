import { type AccessRequest } from "@echo-webkom/db/schemas";

import { apiServer } from "@/api/server";

export const getAccessRequests = async () => {
  return await apiServer.get("admin/access-requests").json<Array<AccessRequest>>();
};
