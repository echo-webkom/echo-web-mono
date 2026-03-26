import { unoWithAdmin } from "@/api/server";

/**
 * Fetches all repeating happenings
 */
export async function fetchAllRepeatingHappenings() {
  return unoWithAdmin.sanity.happenings.repeating().catch(() => {
    console.error("Failed to fetch all repeating happenings");
    return [];
  });
}

/**
 * Fetch a repeating happening by slug
 */
export async function fetchRepeatingHappening(slug: string) {
  return await fetchAllRepeatingHappenings().then((repeatingHappenings) => {
    return repeatingHappenings.find((happening) => happening.slug === slug) ?? null;
  });
}
