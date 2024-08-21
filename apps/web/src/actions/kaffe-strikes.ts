"use server";

import { kaffeApi } from "@/api/kaffe";
import { getUser } from "@/lib/get-user";
import { isMemberOf } from "@/lib/memberships";

export const addKaffeReport = async () => {
  const user = await getUser();

  if (!user || !isMemberOf(user, ["hovedstyret", "webkom"])) {
    return false;
  }

  return await kaffeApi.strike(user.id);
};

export const resetKaffeStrikes = async () => {
  const user = await getUser();

  if (!user) {
    return false;
  }

  if (!isMemberOf(user, ["hovedstyret", "webkom"])) {
    return false;
  }

  return await kaffeApi.reset();
};
