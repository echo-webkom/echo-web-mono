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

export default async function NotificationButton() {
  const notifications = await fetchValidNotifications();

  function handleClick() {
    // notification.viewed = true;
  }

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

              {/* <DropdownMenuItem>
                {notification.viewed ? (
                  <span>{notification.title}</span>
                ) : (
                  <span className=" bg-red-300">{notification.title}</span>
                )}
              </DropdownMenuItem> */}


            // <div>
            //   <DropdownMenuItem onClick={() => handleClick(notification)}>
            //     <span>{notification.title}</span>
            //   </DropdownMenuItem>
            //   // <DropdownMenuSeparator />
            // </div>