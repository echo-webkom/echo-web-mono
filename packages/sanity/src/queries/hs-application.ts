import groq from "groq";

export const allHsApplications = groq`*[_type == "hs-application" && !(_id in path('drafts.**'))] {
  "profile": profile->{
    _id,
    name,
    picture
  },
  "poster": poster.asset->url
}`;
