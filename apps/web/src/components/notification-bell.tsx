"use client";

import { Archive, Bell } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import type { UnoReturnType } from "@/api/uno/client";
import { usePolling } from "@/hooks/use-polling";
import { useUnoClient } from "@/providers/uno";
import { cn } from "@/utils/cn";

import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

type Notification = UnoReturnType["notifications"]["all"][number];

const POLL_INTERVAL_MS = 30_000;

export const NotificationBell = () => {
  const client = useUnoClient();
  const [notifications, setNotifications] = useState<Array<Notification>>([]);

  usePolling(() => {
    void client.notifications.all().then(setNotifications);
  }, POLL_INTERVAL_MS);

  const unreadCount = notifications.filter((n) => n.seenAt === null).length;

  const handleSeen = async (id: number) => {
    const notification = notifications.find((n) => n.id === id);
    if (!notification || notification.seenAt !== null) return;

    await client.notifications.seen(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, seenAt: new Date() } : n)));
  };

  const handleArchive = async (id: number) => {
    await client.notifications.archive(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative" aria-label="Notifikasjoner">
          <Bell className="h-6 w-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-80 p-0">
        <div className="border-b px-4 py-3">
          <p className="font-semibold">Notifikasjoner</p>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-1 py-10 text-center">
              <p className="text-muted-foreground font-mono text-sm font-semibold">404</p>
              <p className="text-muted-foreground text-sm">Du har ingen notifikasjoner</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className="hover:bg-muted/50 flex items-start gap-3 border-b px-4 py-3 last:border-0"
                onMouseEnter={() => void handleSeen(notification.id)}
              >
                <div className="mt-1.5 shrink-0">
                  <div
                    className={cn(
                      "h-2 w-2 rounded-full",
                      notification.seenAt === null ? "bg-blue-500" : "bg-transparent",
                    )}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  {notification.link ? (
                    <Link
                      href={notification.link}
                      className="text-sm leading-tight font-medium hover:underline"
                    >
                      {notification.title}
                    </Link>
                  ) : (
                    <p className="text-sm leading-tight font-medium">{notification.title}</p>
                  )}
                  {notification.content && (
                    <p className="text-muted-foreground mt-0.5 text-xs">{notification.content}</p>
                  )}
                </div>

                <button
                  onClick={() => void handleArchive(notification.id)}
                  className="text-muted-foreground hover:text-foreground mt-0.5 shrink-0 transition-colors"
                  aria-label="Arkiver"
                >
                  <Archive className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
