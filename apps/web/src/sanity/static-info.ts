import { unoWithAdmin } from "@/api/server";
import { pageTypeToUrl } from "./utils/mappers";

/**
 * Fetches all static info pages.
 */
export async function fetchStaticInfo() {
  return await unoWithAdmin.sanity.staticInfo.all().catch(() => {
    console.error("Failed to fetch all static info pages");
    return [];
  });
}

/**
 * Fetches a static info page by its slug.
 *
 * @param pageType the page type to fetch
 * @param slug the slug of the page to fetch
 * @returns
 */
export const fetchStaticInfoBySlug = async (pageType: string, slug: string) => {
  const parsedPageType = Object.keys(pageTypeToUrl).find(
    (key) => pageTypeToUrl[key as keyof typeof pageTypeToUrl] === pageType,
  );

  if (!parsedPageType) {
    return null;
  }

  return await fetchStaticInfo().then((res) =>
    res.find((staticInfo) => staticInfo.slug === slug && staticInfo.pageType === parsedPageType),
  );
};
