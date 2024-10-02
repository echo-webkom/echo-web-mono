import { RxBell as Bell } from "react-icons/rx";

import { fetchNotifications } from "@/sanity/notification/requests";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export const NotificationMenu = async () => {
  const notifications = await fetchNotifications();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button data-testid="notification-menu">
          <Bell className="h-7 w-7" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mx-3 w-56">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.map((notification) => (
          <DropdownMenuItem key={notification._id}>
            <DropdownMenuLabel>{notification.title}</DropdownMenuLabel>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
