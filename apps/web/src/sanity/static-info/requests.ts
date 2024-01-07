import { sanityFetch } from "../client";
import { pageTypeToUrl } from "./mappers";
import { staticInfoQuery } from "./queries";
import { staticInfoSchema } from "./schemas";

/**
 * Fetches all static info pages.
 */
export async function fetchStaticInfo() {
  try {
    return await sanityFetch({
      query: staticInfoQuery,
      tags: ["static-info"],
    }).then((res) => staticInfoSchema.array().parse(res));
  } catch {
    return [];
  }
}

/**
 * Fetches the paths for all static info pages.
 */
export async function fetchStaticInfoPaths() {
  return fetchStaticInfo().then((res) =>
    res.map((staticInfo) => ({
      slug: [pageTypeToUrl[staticInfo.pageType], staticInfo.slug],
    })),
  );
}

/**
 * Fetches a static info page by its slug.
 *
 * @param pageType the page type to fetch
 * @param slug the slug of the page to fetch
 * @returns
 */
export async function fetchStaticInfoBySlug(pageType: string, slug: string) {
  const parsedPageType = Object.keys(pageTypeToUrl).find(
    (key) => pageTypeToUrl[key as keyof typeof pageTypeToUrl] === pageType,
  );

  if (!parsedPageType) {
    return null;
  }

  return await fetchStaticInfo().then((res) =>
    res.find((staticInfo) => staticInfo.slug === slug && staticInfo.pageType === parsedPageType),
  );
}
