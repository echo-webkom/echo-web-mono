import groq from "groq";

export const notificationQuery = groq`
*[_type == "notification" && !(_id in path('drafts.**'))] | order(_createdAt desc) {
  _id,
  title,
  dateFrom,
  dateTo
}
`;
