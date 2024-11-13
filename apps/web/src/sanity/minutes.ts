import { type AllMeetingMinuteQueryResult } from "@echo-webkom/cms/types";
import { allMeetingMinuteQuery } from "@echo-webkom/sanity/queries";

import { sanityFetch } from "./client";

/**
 * Get all meeting minutes.
 */
export const fetchMinutes = async () => {
  return await sanityFetch<AllMeetingMinuteQueryResult>({
    query: allMeetingMinuteQuery,
    tags: ["minutes"],
  }).catch(() => {
    console.error("Failed to fetch meeting minutes");

    return [];
  });
};

/**
 * Fetches a meeting minute by id.
 *
 * @param id the id of the meeting minute you want to fetch
 * @returns the meeting minute or null if not found
 */
export const fetchMinuteById = async (id: string) => {
  return await fetchMinutes().then((res) => res.find((minute) => minute._id === id));
};
