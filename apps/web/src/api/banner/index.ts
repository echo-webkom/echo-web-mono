import {groq} from "next-sanity";

import {sanityClient} from "../sanity.client";
import {bannerSchema, type Banner} from "./schemas";

/**
 * Fetches the banner
 *
 * @returns A banner
 */
export const fetchBanner = async (): Promise<Banner | null> => {
  try {
    const query = groq`
*[_type == "banner" && !(_id in path('drafts.**'))] {
  title,
  subtitle,
  expiresAt,
  link
}[0]
    `;

    const res = await sanityClient.fetch<Banner>(query);

    const banner = bannerSchema.parse(res);

    if (banner.expiresAt && new Date(banner.expiresAt) < new Date()) {
      return null;
    }

    return banner;
  } catch {
    return null;
  }
};
