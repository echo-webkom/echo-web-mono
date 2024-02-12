import { sanityClient, sanityFetch } from "../client";
import { allNotificationsQuery } from "./queries";

export async function fetchAllNotifications() {
    // return await sanityFetch<Array<Notification>>({
    //   query: allNotificationsQuery,
    //   tags: ["notifications"],
    // });
    return await sanityClient.fetch<Array<Notification>>(allNotificationsQuery);
  }
