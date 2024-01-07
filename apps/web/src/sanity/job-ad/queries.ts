import { groq } from "next-sanity";

export const jobAdSlugsQuery = groq`*[_type == "job"]{ "slug": slug.current }`;

export const jobAdPartial = groq`
_id,
_createdAt,
_updatedAt,
title,
"slug": slug.current,
"company": company->{
  _id,
  name,
  website,
  image,
},
"locations": locations[]->{
  _id,
  name,
},
jobType,
link,
deadline,
degreeYears,
body
`;

export const jobAdsQuery = groq`
*[_type == "job"
  && !(_id in path('drafts.**'))]
  | order(_createdAt desc) {
  ${jobAdPartial}
}[0..$n]
`;

export const availableJobAdsQuery = groq`
*[_type == "job"
  && !(_id in path('drafts.**'))
  && deadline >= now()]
  | order(_createdAt desc) {
  ${jobAdPartial}
}[0..$n]
`;

export const jobAdBySlugQuery = groq`
*[_type == "job"
  && slug.current == $slug
  && !(_id in path('drafts.**'))] {
  ${jobAdPartial}
}[0]
      `;
