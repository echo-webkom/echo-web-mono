import groq from "groq";

export const jobAdsQuery = groq`
*[_type == "job"
  && !(_id in path('drafts.**'))]
  | order(weight desc, deadline desc) {
  _id,
  _createdAt,
  _updatedAt,
  weight,
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
}
`;
