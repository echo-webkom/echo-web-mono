import { NotificationQueryResult } from "@/sanity.types";
import { sanityFetch } from "../client";
import { notificationQuery } from "./queries";

/**
 * Fetches a number of notifications
 *
 * @param n number of notification to fetch
 * @returns notification or null if not found
 */

export const fetchNotifications = async () => {
  return await sanityFetch<NotificationQueryResult>({
    query: notificationQuery,
    tags: ["notification"],
  });
};
