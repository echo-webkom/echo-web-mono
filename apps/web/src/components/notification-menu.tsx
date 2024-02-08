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

export default async function NotificationButton() {
  
  const notifications = await fetchAllNotifications();
  
  // dette trenger bedre styling
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button>
          <RxBell className="h-7 w-7" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mx-3 w-56">
        <DropdownMenuLabel>
          <p className="font-normal">Varslinger</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {
          notifications.map((notification) => {
            return (
            <DropdownMenuItem>
              <span>{notification.title}</span>
            </DropdownMenuItem>
            );
          })
        }
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
