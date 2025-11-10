import groq from "groq";

export const allHappeningsQuery = groq`
*[_type == "happening"
  && !(_id in path('drafts.**'))]
  | order(date asc) {
    _id,
  _createdAt,
  _updatedAt,
  title,
  "slug": slug.current,
  isPinned,
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
  "endDate": endDate,
  cost,
  "registrationStartGroups": registrationStartGroups,
  "registrationGroups": registrationGroups[]->slug.current,
  "registrationStart": registrationStart,
  "registrationEnd": registrationEnd,
  "location": location->{
    name,
    link
  },
  "spotRanges": spotRanges[] {
    spots,
    minYear,
    maxYear,
  },
  "additionalQuestions": additionalQuestions[] {
    id,
    title,
    required,
    type,
    options,
  },
  externalLink,
  body
}
`;

export const happeningQuery = groq`
*[_type == "happening"
  && !(_id in path('drafts.**'))
  && slug.current == $slug
][0] {
  _id,
  _createdAt,
  _updatedAt,
  _type,
  title,
  "slug": slug.current,
  isPinned,
  happeningType,
  hideRegistrations,
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
  "endDate": endDate,
  cost,
  "registrationStartGroups": registrationStartGroups,
  "registrationGroups": registrationGroups[]->slug.current,
  "registrationStart": registrationStart,
  "registrationEnd": registrationEnd,
  "location": location->{
    name,
    link
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
  externalLink,
  body
}
`;

export const homeHappeningsQuery = groq`
*[_type == "happening"
  && !(_id in path('drafts.**'))
  && (isPinned || date >= now())
  && happeningType in $happeningTypes
]
| order(coalesce(isPinned, false) desc, date asc) {
  _id,
  title,
  isPinned,
  happeningType,
  date,
  registrationStart,
  "slug": slug.current,
  "image": company->image,
  "organizers": organizers[]->{
    name
  }.name
}[0...$n]`;

export const happeningTypeQuery = groq`
*[_type == "happening"
  && !(_id in path('drafts.**'))
  && slug.current == $slug
 ] {
  happeningType,
}[0].happeningType
`;
