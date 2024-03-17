"use server";

import { auth } from "@echo-webkom/auth";

import { kaffeApi } from "@/api/kaffe";
import { isMemberOf } from "@/lib/memberships";

export async function addKaffeReport() {
  const user = await auth();

  if (!user) {
    return false;
  }

  if (!isMemberOf(user, ["hovedstyret", "webkom"])) {
    return false;
  }

  return await kaffeApi.strike(user.id);
}

export async function resetKaffeStrikes() {
  const user = await auth();

  if (!user) {
    return false;
  }

  if (!isMemberOf(user, ["hovedstyret", "webkom"])) {
    return false;
  }

  return await kaffeApi.reset();
}
