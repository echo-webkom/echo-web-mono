import { sanityClient, sanityFetch } from "../client";
import { allNotificationsQuery, validNotificationsQuery } from "./queries";
import { Notification } from "./schemas";

export async function fetchValidNotifications() {
  // return await sanityFetch<Array<Notification>>({
  //   query: validNotificationsQuery,
  //   tags: ["notifications"],
  // });
  return await sanityClient.fetch<Array<Notification>>(validNotificationsQuery);
}

export async function fetchAllNotifications() {
  // return await sanityFetch<Array<Notification>>({
  //   query: allNotificationsQuery,
  //   tags: ["notifications"],
  // });
  return await sanityClient.fetch<Array<Notification>>(allNotificationsQuery);
}
