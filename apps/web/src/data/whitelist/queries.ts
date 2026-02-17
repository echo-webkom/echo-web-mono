import { unoWithAdmin } from "../../api/server";

export const getWhitelist = async () => {
  return await unoWithAdmin.whitelist.all();
};

export const getWhitelistByEmail = async (email: string) => {
  return await unoWithAdmin.whitelist.getByEmail(email);
};
