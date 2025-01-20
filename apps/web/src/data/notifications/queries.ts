"use server";

import { type Notification } from "@echo-webkom/db/schemas";

import { apiServer } from "@/api/server";

export const getNotifications = async () => {
  return apiServer
    .get("notifications")
    .json<
      Array<
        Notification & {
          user: {
            id: string;
          };
        }
      >
    >()
    .catch((err) => {
      console.error("Error fetching notifications", err);
      return [];
    });
};
