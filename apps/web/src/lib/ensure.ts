import { redirect } from "next/navigation";

import { auth } from "@echo-webkom/auth";

import { isMemberOf } from "./memberships";

export const ensureUser = async (groups?: Array<string>) => {
  const user = await auth();

  if (!user) {
    return redirect("/");
  }

  if (groups && !isMemberOf(user, groups)) {
    return redirect("/");
  }

  return user;
};

export const ensureWebkom = async () => ensureUser(["webkom"]);
