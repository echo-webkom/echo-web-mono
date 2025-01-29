import { type Whitelist } from "@echo-webkom/db/schemas";

import { apiServer } from "@/api/server";

export const getWhitelist = async () => {
  return await apiServer.get("admin/whitelist").json<Array<Whitelist>>();
};

export const getWhitelistByEmail = async (email: string) => {
  return await apiServer.get(`admin/whitelist/${email}`).json<Whitelist | null>();
};
