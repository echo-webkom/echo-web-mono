import { unoWithAdmin } from "@/api/server";

export const getAccessRequests = async () => {
  return unoWithAdmin.accessRequests.all();
};
