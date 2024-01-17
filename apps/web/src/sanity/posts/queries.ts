import { groq } from "next-sanity";

export const postPartial = groq`
_id,
_createdAt,
_updatedAt,
title,
"slug": slug.current,
"authors": authors[]->{
  _id,
  name,
  image,
},
image,
body
`;

export const allPostsQuery = groq`
*[_type == "post" && !(_id in path('drafts.**'))] | order(_createdAt desc) {
  ${postPartial}
}
`;
