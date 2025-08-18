import groq from "groq";

export const allUtlanQuery = groq`
*[_type == "utlan" && !(_id in path('drafts.**'))] | order(_createdAt desc) {
  _id,
  _createdAt,
  _updatedAt,
  title,
  "slug": slug.current,
  image,
  body
}
`;
