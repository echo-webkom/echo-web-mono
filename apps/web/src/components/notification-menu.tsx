import Link from "next/link";
import { RxBell } from "react-icons/rx";

import { fetchAllNotifications } from "@/sanity/notifications/requests";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

type NotificationButtonProps = {};

export default async function NotificationButton() {
  
  // const notifications = await fetchAllNotifications();

  
  function displayNotifications() {
    return (
    <DropdownMenuItem asChild>
    
    </DropdownMenuItem>);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button>
          <RxBell className="h-7 w-7" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mx-3 w-56">
        <DropdownMenuLabel>
          <p className="font-normal">Varsler</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* {
          notifications.map((notification) => {
            return (
            <DropdownMenuItem asChild>
              <span>{notification.title}</span>
              <span>test</span>
            </DropdownMenuItem>);
          })
        } */}

      </DropdownMenuContent>
    </DropdownMenu>
  );
}
