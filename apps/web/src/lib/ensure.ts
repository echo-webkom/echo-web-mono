import "server-only";

import { redirect } from "next/navigation";

import { auth } from "@echo-webkom/auth";

import { isMemberOf } from "./memberships";

/**
 * Ensure that the user is logged in and optionally a member of the given groups.
 *
 * @param groups - the groups the user must be a member of
 * @returns the user
 */
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

/**
 * Wrapper around ensureUser that ensures the user is a member of the webkom group.
 *
 * @see ensureUser
 * @returns the user
 */
export const ensureWebkom = async () => ensureUser(["webkom"]);
