import type { UsersToGroups } from "@echo-webkom/db/schemas";
import { type Group } from "@echo-webkom/lib";

export type TUser = {
  memberships: Array<UsersToGroups>;
};

export const isMemberOf = <U extends TUser>(user: U, groupIds: Array<Group>) => {
  return user.memberships.some((membership) => groupIds.includes(membership.groupId));
};

export const isWebkom = <U extends TUser>(user: U) => {
  return isMemberOf(user, ["webkom"]);
};

export const isBedkom = <U extends TUser>(user: U) => {
  return isMemberOf(user, ["bedkom"]);
};

export const isHost = <U extends TUser>(user: U, groups: Array<string>) => {
  return isMemberOf(user, groups) || isWebkom(user);
};

export const isMemberOfAny = <U extends TUser>(user: U) => {
  return user.memberships.length > 0;
};
