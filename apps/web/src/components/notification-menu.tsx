import { RxBell } from "react-icons/rx";

import { fetchValidNotifications } from "@/sanity/notifications/requests";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Notification } from "@/sanity/notifications/schemas";
import { cookies } from "next/headers";


export default async function NotificationButton() {
  const notifications: Notification[] = await fetchValidNotifications();

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
          return (
            <div>
              {notification.viewed ? (
                <DropdownMenuItem>
                  <span>{notification.title}</span>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem  className=" bg-red-200">
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
