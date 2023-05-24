import {type Group, type Happening, type User} from "@echo-webkom/db/types";

export const isEventOrganizer = (user: User, happening: Happening): boolean => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  const organizerGroups = happening.groups as Array<Group>;

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  const userGroups = user.studentGroups as Array<Group>;

  return organizerGroups.some((organizerGroup) =>
    userGroups.some((userGroup) => userGroup === organizerGroup),
  );
};
