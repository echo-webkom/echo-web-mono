import { and, eq, gte } from "drizzle-orm";

import { groups, happenings, happeningsToGroups } from "@echo-webkom/db/schemas";
import { db } from "@echo-webkom/db/serverless";

import { getNotifications } from "@/data/notifications/queries";
import { getUser } from "@/lib/get-user";

// export const fetchUserNotifications = async () => {
//   const user = await getUser();

//   if (!user) {
//     return [];
//   }

//   const notifications = await getNotifications();

//   const currentDate = new Date().toISOString();
//   return notifications.filter(
//     (notification) =>
//       notification.user.id === user.id &&
//       notification.dateFrom <= currentDate &&
//       notification.dateTo >= currentDate,
//   );
// };

export async function getHappeningsForGroup(groupName: string) {
  const today = Date();

  const group = await db.query.groups.findFirst({
    where: eq(groups.id, groupName.toLowerCase()),
  });

  if (!group) {
    throw new Error(`Group "${groupName}" not found`);
  }

  const happeningList = await db
    .select({
      id: happenings.id,
      title: happenings.title,
      slug: happenings.slug,
      type: happenings.type,
      date: happenings.date,
      registrationGroups: happenings.registrationGroups,
      registrationStartGroups: happenings.registrationStartGroups,
      registrationStart: happenings.registrationStart,
      registrationEnd: happenings.registrationEnd,
    })
    .from(happenings)
    .innerJoin(happeningsToGroups, eq(happenings.id, happeningsToGroups.happeningId))
    .where(and(eq(happeningsToGroups.groupId, group.id), gte(happenings.date, today)))
    .orderBy(happenings.date);

  return happeningList;
}
