import { and, eq, inArray } from "drizzle-orm";
import { RxBell } from "react-icons/rx";

import { auth } from "@echo-webkom/auth";
import { db } from "@echo-webkom/db";

import { fetchValidNotifications } from "@/sanity/notifications/requests";
import { type Notification } from "@/sanity/notifications/schemas";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default async function NotificationButton() {
  const user = await auth();

  if (!user) {
    return null;
  }

  const notifications = await fetchValidNotifications();

  const usersToNotifications = await db.query.usersToNotifications.findMany({
    where: (userToNotification) =>
      and(
        inArray(
          userToNotification.notificationId,
          notifications.map((notification) => notification._id),
        ),
        eq(userToNotification.userId, user.id),
      ),
  });

  const viewedNotifications = usersToNotifications.map(
    (userToNotification) => userToNotification.notificationId,
  );

  const hasViewed = (notification: Notification) => {
    return viewedNotifications.includes(notification._id);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button>
          <RxBell className="h-7 w-7" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mx-3 min-w-[30rem]">
        <DropdownMenuLabel>
          <p className="font-bold">Varslinger</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.map((notification) => {
          const viewed = hasViewed(notification);
          return (
            <div key={notification._id}>
              {viewed ? (
                <DropdownMenuItem>
                  <span>{notification.title}</span>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem className="bg-red-200">
                  <span>{notification.title}</span>
                </DropdownMenuItem>
              )}
            </div>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
