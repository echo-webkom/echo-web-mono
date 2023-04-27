import {groq} from "next-sanity";

import {sanityClient} from "../sanity.client";
import {siteSettingsSchema, type Banner, type SiteSettings} from "./schemas";

/**
 * Fetches the banner
 *
 * @returns A banner
 */
export const fetchBanner = async (): Promise<Banner | null> => {
  try {
    const query = groq`
*[_id == "siteSettings" && !(_id in path('drafts.**'))][0] {
  showBanner,
  banner {
    title,
    subtitle,
    expiresAt,
    link,
  }
}
    `;

    const res = await sanityClient.fetch<SiteSettings>(query);

    const settings = siteSettingsSchema.parse(res);

    if (!settings.showBanner) {
      return null;
    }

    if (settings.banner?.expiresAt && new Date() < new Date(settings.banner.expiresAt)) {
      return null;
    }

    if (!settings.banner?.title) {
      return null;
    }

    return settings.banner;
  } catch (e) {
    console.error(e);
    return null;
  }
};
