import {
  type groups,
  type happeningsToGroups,
  type User,
  type usersToGroups,
} from "@echo-webkom/db/schemas";
import { isWebkom } from "./user";

type TUser = User & {
  memberships: Array<
    typeof usersToGroups.$inferSelect & {
      group: typeof groups.$inferSelect;
    }
  >;
};

type THappening = {
  groups: Array<
    typeof happeningsToGroups.$inferSelect & {
      group: typeof groups.$inferSelect;
    }
  >;
};

export function isHost<U extends TUser, H extends THappening>(user: U, happening: H) {
  return (
    user.memberships.some((membership) =>
      happening.groups.some((group) => group.groupId === membership.groupId),
    ) || isWebkom(user)
  );
}
