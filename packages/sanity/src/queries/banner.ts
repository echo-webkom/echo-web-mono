import groq from "groq";

export const bannerQuery = groq`
*[_type == "banner" && _id == "banner" && !(_id in path('drafts.**'))] {
  backgroundColor,
  textColor,
  text,
  expiringDate,
  linkTo,
  isExternal,
}[0]
`;
