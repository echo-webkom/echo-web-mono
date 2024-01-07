import { groq } from "next-sanity";

export const postSlugsQuery = groq`*[_type == "post"]{ "slug": slug.current }`;

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

export const nPostsQuery = groq`
*[_type == "post" && !(_id in path('drafts.**'))] | order(_createdAt desc) {
  ${postPartial}
}[0...$n]
`;

export const allPostsQuery = groq`
*[_type == "post" && !(_id in path('drafts.**'))] | order(_createdAt desc) {
  ${postPartial}
}
`;

export const postsByPageQuery = groq`
*[_type == "post" && !(_id in path('drafts.**'))]| order(_createdAt desc) {
  ${postPartial}
}[$start...$end]
  `;

export const postBySlugQuery = groq`
*[_type == "post"
  && slug.current == $slug
  && !(_id in path('drafts.**'))]
  | order(_createdAt desc) {
  ${postPartial}
}[0]
`;
