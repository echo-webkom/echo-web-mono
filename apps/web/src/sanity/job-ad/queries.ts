import { groq } from "next-sanity";

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
}
`;
