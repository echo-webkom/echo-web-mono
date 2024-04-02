import "server-only";

import { redirect } from "next/navigation";

import { auth } from "@echo-webkom/auth";

import { isMemberOf } from "./memberships";

type EnsureOptions = {
  redirectTo?: string;
};

/**
 * Ensure that the user is logged in and optionally a member of the given groups.
 *
 * @param groups - the groups the user must be a member of
 * @returns the user
 */
export const ensureUser = async (groups?: Array<string>, options: EnsureOptions = {}) => {
  const user = await auth();

  if (!user) {
    return redirect(options.redirectTo ?? "/");
  }

  if (groups && !isMemberOf(user, groups)) {
    return redirect(options.redirectTo ?? "/");
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

/**
 * Wrapper around ensureUser that ensures the user is a member of webkom or hovedstyret.
 *
 * @see ensureUser
 * @returns the user
 */
export const ensureWebkomOrHovedstyret = async () => ensureUser(["webkom", "hovedstyret"]);

/**
 * Wrapper around ensureUser that ensures the user is a member of the bedkom group.
 *
 * @see ensureUser
 * @returns the user
 */
export const ensureBedkom = async () => ensureUser(["bedkom", "webkom"]);
