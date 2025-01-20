"use client";

import { useEffect, useState } from "react";
import { RxBell as Bell } from "react-icons/rx";

import { getNotifications } from "@/data/notifications/queries";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

type Notification = {
  id: string;
  title: string;
  dateFrom: string;
  dateTo: string;
};

export const NotificationMenu = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getNotifications();
      setNotifications(
        result.map((notification) => ({
          id: notification.id,
          title: notification.name,
          dateFrom: notification.dateFrom,
          dateTo: notification.dateTo,
        })),
      );
    };
    fetchData();
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button data-testid="notification-menu">
          <Bell className="h-6 w-6" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mx-3 w-56">
        <DropdownMenuLabel>Notifikasjoner</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <DropdownMenuItem>Du har ingen notifikasjoner!</DropdownMenuItem>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem key={notification.id}>
              <DropdownMenuLabel className="truncate">{notification.title}</DropdownMenuLabel>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
