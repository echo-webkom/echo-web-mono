import { groq } from "next-sanity";

import { client } from "@echo-webkom/sanity";

import { contactProfileSchema } from "../profile/schemas";

const query = groq`
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
  try {
    return await client
      .fetch(query, { slug })
      .then((res) => contactProfileSchema.array().parse(res));
  } catch {
    return [];
  }
}
