"use server";

import { kaffeApi } from "@/api/kaffe";
import { isMemberOf } from "@/lib/memberships";
import { authedAction } from "@/lib/safe-actions";

export const addKaffeReport = authedAction.create(async ({ ctx }) => {
  if (!isMemberOf(ctx.user, ["hovedstyret", "webkom"])) {
    throw new Error("Du har ikke tilgang til å legge til kaffestrike");
  }

  return await kaffeApi.strike(ctx.user.id);
});

export const resetKaffeStrikes = authedAction.create(async ({ ctx }) => {
  if (!isMemberOf(ctx.user, ["hovedstyret", "webkom"])) {
    throw new Error("Du har ikke tilgang til å nullstille kaffestrikes");
  }

  return await kaffeApi.reset();
});
