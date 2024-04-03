import { groq } from "next-sanity";

export const moviesPartial = groq`
_id,
title,
date,
link,
image,
`;

export const moviesQuery = groq`
*[_type == "movie"
  && !(_id in path('drafts.**'))]
  | order(_createdAt desc) {
${moviesPartial}
}
`;
