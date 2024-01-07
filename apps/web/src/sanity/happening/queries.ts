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

export const allHappeningsQuery = groq`
*[_type == "happening"
  && !(_id in path('drafts.**'))]
  | order(date asc) {
  ${happeningPartial}
}
`;
