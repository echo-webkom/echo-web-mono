import groq from "groq";

export const bannerQuery = groq`
*[_type == "banner"] {
  backgroundColor,
  textColor,
  text,
  linkTo,
  isExternal,
}[0]
`;
