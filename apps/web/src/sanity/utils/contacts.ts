import groq from "groq";

import { client } from "@echo-webkom/sanity";

import { type HappeningContactsQueryResult } from "@/sanity.types";

const happeningContactsQuery = groq`
*[_type == "happening" && slug.current == $slug] {
"contacts": contacts[] {
email,
"profile": profile->{
  _id,
  name,
},
},
}[0].contacts
`;

export async function getContactsBySlug(slug: string) {
  return await client
    .fetch<HappeningContactsQueryResult>(happeningContactsQuery, { slug })
    .then((data) => data ?? [])
    .catch(() => []);
}
