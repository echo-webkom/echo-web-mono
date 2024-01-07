import { groq } from "next-sanity";

export const staticInfoPathsQuery = groq`*[_type == "staticInfo" && !(_id in path('drafts.**'))]{ "slug": slug.current, pageType }`;

export const staticInfoBySlugQuery = groq`
*[_type == "staticInfo"
  && slug.current == $slug
  && pageType == $pageType
  && !(_id in path('drafts.**'))] {
  title,
  "slug": slug.current,
  pageType,
  body
}[0]
`;
