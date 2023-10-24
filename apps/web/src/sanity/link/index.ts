import { groq } from "next-sanity";

import { sanityFetch } from "../client";
import { linkSchema, type Link } from "./schemas";

export * from "./schemas";


/**
 * Get the n last published links.
 * @param n how many links to retrieve
 */
export async function fetchLinks(n: number) {
    // TODO: ponder if image is neccessary
  const query = groq`
*[_type == "link" && !(_id in path('drafts.**'))][0...$n] | order(_createdAt desc) {
  _id,
  _createdAt,
  _updatedAt,
  title,
  "authors": authors[]->{
    _id,
    name,
    image,
  },
  image,
  body
}
  `;

  const params = {
    n,
  };

  const result = await sanityFetch<Array<Link>>({
    query,
    params,
    tags: ["links"],
  });

  return linkSchema.array().parse(result);
}
