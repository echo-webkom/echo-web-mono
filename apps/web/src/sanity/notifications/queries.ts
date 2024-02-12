import { groq } from "next-sanity";

export const validNotificationsQuery = groq`
*[_type == "notification" && !(_id in path('drafts.**')) && validTo > now()] | order(_createdAt desc) {
  _id,
  title,
  subtitle,
  publishedAt,
  validTo,
}
`;

export const allNotificationsQuery = groq`
*[_type == "notification" && !(_id in path('drafts.**'))] | order(_createdAt desc) {
  _id,
  title,
  subtitle,
  publishedAt,
  validTo,
}
`
