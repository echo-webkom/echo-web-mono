import { type Group } from "@echo-webkom/lib";

export type TUser = {
  groups: Array<{ id: string }>;
};

export const isMemberOf = <U extends TUser>(user: U, groupIds: Array<Group>) => {
  return user.groups.some((group) => groupIds.includes(group.id));
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
