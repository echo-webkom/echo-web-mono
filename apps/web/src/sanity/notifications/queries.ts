import { groq } from "next-sanity";

export const allNotificationsQuery = groq`
*[_type == "notification" && !(_id in path('drafts.**')) && validTo > now()] | order(_createdAt desc) {
  _id,
  title,
  subtitle,
  publishedAt,
  validTo,
}
`;
