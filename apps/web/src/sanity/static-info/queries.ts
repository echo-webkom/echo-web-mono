import groq from "groq";

export const staticInfoQuery = groq`
*[_type == "staticInfo" && !(_id in path('drafts.**'))] {
  title,
  "slug": slug.current,
  pageType,
  body
}
`;
