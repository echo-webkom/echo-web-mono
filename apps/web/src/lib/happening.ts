import {type Group, type Happening, type User} from "@echo-webkom/db";

export const isEventOrganizer = (user: User, happening: Happening): boolean => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  const organizerGroups = happening.groups as Group[];

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  const userGroups = user.studentGroups as Group[];

  return organizerGroups.some((organizerGroup) =>
    userGroups.some((userGroup) => userGroup === organizerGroup),
  );
};
