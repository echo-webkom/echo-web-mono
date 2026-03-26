import { unoWithAdmin } from "@/api/server";

/**
 * Get all meeting minutes.
 */
export async function fetchMinutes() {
  return await unoWithAdmin.sanity.minutes.all().catch(() => {
    console.error("Failed to fetch meeting minutes");

    return [];
  });
}

/**
 * Fetches a meeting minute by id.
 *
 * @param id the id of the meeting minute you want to fetch
 * @returns the meeting minute or null if not found
 */
export async function fetchMinuteById(id: string) {
  return await fetchMinutes().then((res) => res.find((minute) => minute._id === id));
}
