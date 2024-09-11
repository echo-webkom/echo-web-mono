import { db } from "@echo-webkom/db/serverless";

export const getAccessRequests = async () => {
  return await apiServer.get("admin/access-requests").json<Array<AccessRequest>>();
};
