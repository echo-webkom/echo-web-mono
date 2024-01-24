import { type Group, type UsersToGroups } from "@echo-webkom/db/schemas";

export type Userable = {
  memberships: Array<
    UsersToGroups & {
      group: Group;
    }
  >;
};

export const isMemberOf = <TUser extends Userable>(user: TUser, groupIds: Array<string>) => {
  return user.memberships.some((membership) => groupIds.includes(membership.groupId));
};

export const isWebkom = <TUser extends Userable>(user: TUser) => {
  return isMemberOf(user, ["webkom"]);
};
