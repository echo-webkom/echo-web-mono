import { sanityFetch } from "../client";
import { pageTypeToUrl } from "./mappers";
import { staticInfoBySlugQuery, staticInfoPathsQuery } from "./queries";
import { staticInfoSchema } from "./schemas";

/**
 * Fetches the paths for all static info pages.
 *
 * @returns
 */
export async function fetchStaticInfoPaths() {
  try {
    const staticPaths = await sanityFetch({
      query: staticInfoPathsQuery,
      tags: ["static-info-paths"],
    }).then((res) => staticInfoSchema.pick({ slug: true, pageType: true }).array().parse(res));

    return staticPaths.map((staticInfo) => ({
      slug: [pageTypeToUrl[staticInfo.pageType], staticInfo.slug],
    }));
  } catch {
    return [];
  }
}

export async function fetchStaticInfoBySlug(pageType: string, slug: string) {
  const parsedPageType = Object.keys(pageTypeToUrl).find(
    (key) => pageTypeToUrl[key as keyof typeof pageTypeToUrl] === pageType,
  );

  if (!parsedPageType) {
    return null;
  }

  try {
    return await sanityFetch({
      query: staticInfoBySlugQuery,
      params: {
        slug,
        pageType: parsedPageType,
      },
      tags: [`static-info-${slug}`],
    }).then((res) => staticInfoSchema.parse(res));
  } catch {
    return null;
  }
}
