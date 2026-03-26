import { unoWithAdmin } from "@/api/server";

/**
 * Fetches all merch.
 */
export async function fetchAllMerch() {
  return await unoWithAdmin.sanity.merch.all().catch(() => {
    console.error("Failed to fetch all merch");

    return [];
  });
}

export async function fetchMerch(n?: number) {
  const merch = await fetchAllMerch();

  return n ? merch.slice(0, n) : merch;
}

/**
 * Fetches a merch item by its slug
 *
 * @param slug the slug of the merch items you want to fetch
 * @returns the merch item or null if not found
 */
export async function fetchMerchBySlug(slug: string) {
  return await fetchMerch().then((res) => res.find((item) => item.slug === slug) ?? null);
}
