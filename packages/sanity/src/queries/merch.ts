import groq from "groq";

export const merchQuery = groq`
*[_type == "merch" && !(_id in path('drafts.**'))] | order(_createdAt desc) {
  _id,
  _createdAt,
  _updatedAt,
  title,
  "slug": slug.current,
  title,
  text,
  slug,
  cost,
  image,
}
`;
