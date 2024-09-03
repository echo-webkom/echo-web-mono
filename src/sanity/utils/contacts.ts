import groq from "groq";

import { type HappeningContactsQueryResult } from "@/sanity.types";
import { client } from "../client";

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

export const getContactsBySlug = async (slug: string) => {
  return await client
    .fetch<HappeningContactsQueryResult>(happeningContactsQuery, { slug })
    .then((data) => data ?? [])
    .catch(() => []);
};
