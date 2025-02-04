// "use server";

import NotificationPage from "@/components/notifications/notification-page";
import { getUser } from "@/lib/get-user";
import { getHappeningsForGroup } from "@/lib/notification-helpers";

export default async function Notifications() {
  const user = await getUser();
  const happenings = await getHappeningsForGroup(user.memberships.at(0)?.group.name);

  if (!user) {
    return <div>Du må være logget inn for å lage en notifikasjon</div>;
  }

  return <NotificationPage user={user} happenings={happenings}></NotificationPage>;
}
