import { RxBell } from "react-icons/rx";

import { fetchValidNotifications } from "@/sanity/notifications/requests";
import { Notification } from "@/sanity/notifications/schemas";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

function isActive(notification: Notification) {
  const now = new Date().getTime();
  const start = new Date(notification.validTo).getTime();
  return true;
  // return now < start;
}

export default async function NotificationButton() {
  const notifications = await fetchValidNotifications();

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
          if (isActive(notification)) {
            return (
              <div>
              <DropdownMenuItem>
                <span>{notification.title}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              </div>
            );
          }
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
