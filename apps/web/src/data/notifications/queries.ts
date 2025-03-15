"use server";

import { type Notification } from "@echo-webkom/db/schemas";

import { apiServer } from "@/api/server";

export const getNotifications = async () => {
  try {
    const rawNotifications = await apiServer
      .get("notifications", {
        cache: "no-store",
      })
      .json<
        Array<
          Notification & {
            user: {
              id: string;
            };
          }
        >
      >();

    return rawNotifications.map((notification) => ({
      id: notification.id,
      title: notification.name,
      dateFrom: notification.dateFrom,
      dateTo: notification.dateTo,
    }));
  } catch (err) {
    console.error("Error fetching notifications", err);
    return [];
  }
};
