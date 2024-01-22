import { groq } from "next-sanity";

export const bannerQuery = groq`
*[_id == "settings"][0].banner {
  showBanner,
  title,
  subtitle,
  link,
}
`;
