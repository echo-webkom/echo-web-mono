"use server";

import NotificationPage from "@/auth/notification-page";
import { getUser } from "@/lib/get-user";

export default async function Notifications() {
  const user = await getUser();

  if (!user) {
    return <div>Du må være logget inn for å lage en notifikasjon</div>;
  }

  return <NotificationPage user={user}></NotificationPage>;
}
