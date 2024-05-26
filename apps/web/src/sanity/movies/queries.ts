import groq from "groq";

export const moviesQuery = groq`
*[_type == "movie"
  && !(_id in path('drafts.**'))]
  | order(_createdAt desc) {
  _id,
  title,
  date,
  link,
  image,
}
`;
