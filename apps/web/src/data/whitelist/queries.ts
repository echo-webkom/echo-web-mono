import { type Whitelist } from "@echo-webkom/db/schemas";

import { apiServer } from "@/api/server";

export const getWhitelist = async () => {
  return await apiServer.get("whitelist").json<Array<Whitelist>>();
};

export const getWhitelistByEmail = async (email: string) => {
  return await apiServer.get(`whitelist/${email}`).json<Whitelist | null>();
};
