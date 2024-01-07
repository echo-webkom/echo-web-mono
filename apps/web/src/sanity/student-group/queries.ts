import { groq } from "next-sanity";

export const studentGroupPathsQuery = groq`*[_type == "studentGroup" && groupType != "hidden"]{ "slug": slug.current, groupType }`;

export const studentGroupPartial = groq`
_id,
_createdAt,
_updatedAt,
name,
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
`;

export const studentGroupsByTypeQuery = (orderDir: "asc" | "desc") => groq`
*[_type == "studentGroup"
  && groupType == $type
  && !(_id in path('drafts.**'))] | order(name ${orderDir}) {
  ${studentGroupPartial}
}[0..$n]
`;

export const studentGroupBySlugQuery = groq`
*[_type == "studentGroup"
  && slug.current == $slug
  && !(_id in path('drafts.**'))] {
  ${studentGroupPartial}
}[0]
`;
