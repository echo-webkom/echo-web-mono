import { groq } from "next-sanity";

export const bannerQuery = groq`
*[_id == "settings"][0] {
  "title": banner.title,
  "subtitle": banner.subtitle,
  "link": banner.link
}
`;
