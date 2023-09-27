import { type Happening, type User } from "@echo-webkom/db";

export function isEventOrganizer(user: User, happening: Happening) {
  const organizerGroups = happening.groups;
  const userGroups = user.studentGroups;

  return organizerGroups.some((organizerGroup) =>
    userGroups.some((userGroup) => userGroup === organizerGroup),
  );
}
