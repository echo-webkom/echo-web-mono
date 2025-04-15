import groq from "groq";

export const allMerchQuery = groq`
*[_type == "merch" && !(_id in path('drafts.**'))] | order(_createdAt desc) {
  _id,
  _createdAt,
  _updatedAt,
  title,
  "slug": slug.current,
  price,
  image,
  body
}
`;
