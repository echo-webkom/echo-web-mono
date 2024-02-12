import { sanityClient, sanityFetch } from "../client";
import { validNotificationsQuery } from "./queries";

type Notification = {
  _id: string;
  title: string;
  subtitle: string;
  publishedAt: string;
  validTo: string;
};

export async function fetchValidNotifications() {
    // return await sanityFetch<Array<Notification>>({
    //   query: validNotificationsQuery,
    //   tags: ["notifications"],
    // });
    return await sanityClient.fetch<Array<Notification>>(validNotificationsQuery);
  }
