import groq from "groq";

export const studentGroupsByTypeQuery = groq`
*[_type == "studentGroup"
  && groupType == $type
  && !(_id in path('drafts.**'))] | order(_createdAt asc) {
  _id,
  _createdAt,
  _updatedAt,
  name,
  isActive,
  groupType,
  "slug": slug.current,
  description,
  image,
  "members": members[] {
    role,
    "profile": profile->{
      _id,
      name,
      picture,
      socials,
    },
  },
  "socials": socials {
    facebook,
    instagram,
    linkedin,
    email,
  }
}[0..$n]
`;

export const studentGroupBySlugQuery = groq`
*[_type == "studentGroup"
  && slug.current == $slug
  && !(_id in path('drafts.**'))] {
  _id,
  _createdAt,
  _updatedAt,
  name,
  isActive,
  groupType,
  "slug": slug.current,
  description,
  image,
  "members": members[] {
    role,
    "profile": profile->{
      _id,
      name,
      picture,
      socials,
    },
  },
  "socials": socials {
    facebook,
    instagram,
    linkedin,
    email,
  }
}[0]
`;

export const studentGroupsByProfileIdQuery = groq`
*[_type == "studentGroup"
  && !(_id in path('drafts.**'))
  && $profileId in members[].profile->_id] | order(_createdAt asc) {
  _id,
  "slug": slug.current,
}
`;
