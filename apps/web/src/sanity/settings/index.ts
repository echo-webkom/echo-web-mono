import { groq } from "next-sanity";

import { sanityClient } from "../client";
import { type Banner } from "./schemas";

const bannerQuery = groq`
*[_id == "settings"][0].banner {
  showBanner,
  title,
  subtitle,
  link,
}
`;

export async function getBanner() {
  return await sanityClient.fetch<Banner | null>(bannerQuery);
}
