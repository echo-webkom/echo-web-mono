import groq from "groq";

export const notificationQuery = groq`
*[_type == "notification" && !(_id in path('drafts.**')) && dateTime(now()) >= dateTime(dateFrom) && dateTime(now()) <= dateTime(dateTo)]| order(_createdAt desc){
  _id,
  title,
  dateFrom,
  dateTo
}
`;
