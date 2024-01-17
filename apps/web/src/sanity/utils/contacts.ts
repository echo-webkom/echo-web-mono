import { groq } from "next-sanity";

import { sanityClient } from "../client";
import { contactProfileSchema } from "../profile/schemas";

export async function getContactsBySlug(slug: string) {
  try {
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

    return await sanityClient
      .fetch(query, { slug })
      .then((res) => contactProfileSchema.array().parse(res));
  } catch {
    return [];
  }
}
