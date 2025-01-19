import groq from "groq";

export const bannerQuery = groq`
*[_type == "banner"] {
  color,
  textColor,
  text,
  linkTo,
  isExternal,
}[0]
`;
