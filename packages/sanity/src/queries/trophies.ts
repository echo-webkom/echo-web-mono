import groq from "groq";

export const allTrophiesQuery = groq`
*[_type == "trophies"] | order(title asc) {
  _id,
  title,
  "slug": slug.current,
  baseImage,
  baseDescription,
  trophies[]{
    _key,
    title,
    description,
    level,
    image
  },
}
`;

export const trophiesBySlugQuery = groq`
*[_type == "trophies" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  baseImage,
  baseDescription,
  trophies[]{
    _key,
    title,
    description,
    level,
    image
  }
`;
