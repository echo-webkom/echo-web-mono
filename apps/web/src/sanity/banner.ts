import { type BannerQueryResult } from "@echo-webkom/cms/types";
import { bannerQuery } from "@echo-webkom/sanity/queries";

import { sanityFetch } from "./client";

/**
 * Fetches info for the banner
 */

export const fetchBannerInfo = async () => {
  return await sanityFetch<BannerQueryResult>({
    query: bannerQuery,
    tags: ["banner"],
  });
};
