import {groq} from "next-sanity";

import {serverFetch} from "../client";
import {
  bannerSettingsSchema,
  footerSectionSchema,
  type Banner,
  type BannerSettings,
  type FooterSection,
} from "./schemas";

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

    const res = await serverFetch<BannerSettings>(query);

    const settings = bannerSettingsSchema.parse(res);

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
  } catch {
    return null;
  }
};

export const fetchFooter = async () => {
  const query = groq`
*[_id == "siteSettings" && !(_id in path('drafts.**'))][0] {
  footer[] {
    title,
    links[] {
      title,
      link
    }
  }
}.footer
`;

  const res = await serverFetch<Array<FooterSection>>(query);

  const footerSections = footerSectionSchema.array().parse(res);

  return footerSections;
};
