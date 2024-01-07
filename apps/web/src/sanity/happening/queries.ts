import { groq } from "next-sanity";

export const happeningPartial = groq`
  _id,
  _createdAt,
  _updatedAt,
  title,
  "slug": slug.current,
  happeningType,
  "company": company->{
    _id,
    name,
    website,
    image,
  },
  "organizers": organizers[]->{
    _id,
    name,
    "slug": slug.current
  },
  "contacts": contacts[] {
    email,
    "profile": profile->{
      _id,
      name,
    },
  },
  "date": date,
  cost,
  "registrationStartGroups": registrationStartGroups,
  "registrationGroups": registrationGroups[]->slug.current,
  "registrationStart": registrationStart,
  "registrationEnd": registrationEnd,
  "location": location->{
    name,
  },
  "spotRanges": spotRanges[] {
    spots,
    minYear,
    maxYear,
  },
  "additionalQuestions": additionalQuestions[] {
    title,
    required,
    type,
    options,
  },
  body
`;

export const upcomingHappeningQuery = groq`
*[_type == "happening"
  && happeningType == $type
  && !(_id in path('drafts.**'))
  && date >= now()]
  | order(date asc)
  [0...$n] {
  ${happeningPartial}
}
`;

export const happeningBySlugQuery = groq`
*[_type == "happening"
  && slug.current == $slug
  && !(_id in path('drafts.**'))] {
${happeningPartial}
}[0]
`;

export const happeningTypeBySlugQuery = groq`
*[_type == "happening" && slug.current == $slug] {
  happeningType,
}.happeningType
`;
