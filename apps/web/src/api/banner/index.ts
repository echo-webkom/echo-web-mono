import {groq} from "next-sanity";
import {sanityClient} from "../sanity.client";
import {Banner, bannerSchema} from "./schemas";

/**
 * Fetches the banner
 *
 * @returns A banner
 */
export const fetchBanner = async (): Promise<Banner | null> => {
  try {
    const query = groq`
      *[_type == "banner" && !(_id in path('drafts.**'))] {
        color,
        textColor,
        text,
        linkTo,
        isExternal
      }[0]
    `;

    const res = await sanityClient.fetch<Banner>(query);

    return bannerSchema.parse(res);
  } catch {
    return null;
  }
};
