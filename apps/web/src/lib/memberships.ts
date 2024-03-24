import type { HappeningsToGroups, UsersToGroups } from "@echo-webkom/db/schemas";

export type TUser = {
  memberships: Array<UsersToGroups>;
};

export type Hostable = {
  groups: Array<HappeningsToGroups>;
};

export const isMemberOf = <U extends TUser>(user: U, groupIds: Array<string>) => {
  return user.memberships.some((membership) => groupIds.includes(membership.groupId));
};

export const isWebkom = <U extends TUser>(user: U) => {
  return isMemberOf(user, ["webkom"]);
};

export const isBedkom = <U extends TUser>(user: U) => {
  return isMemberOf(user, ["bedkom"]);
};

export function isHost<U extends TUser, H extends Hostable>(user: U, happening: H) {
  return (
    isMemberOf(
      user,
      happening.groups.map((group) => group.groupId),
    ) || isWebkom(user)
  );
}
