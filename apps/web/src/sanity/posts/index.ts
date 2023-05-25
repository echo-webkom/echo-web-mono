import {groq} from "next-sanity";

import {serverFetch} from "../client";
import {slugSchema} from "../utils/slug";
import {postSchema, type Post} from "./schemas";

export * from "./schemas";

/**
 * Get all slugs for posts.
 * @returns an array of slugs
 */
export const fetchPostParams = async () => {
  const query = groq`*[_type == "post"]{ "slug": slug.current }`;
  const result = await serverFetch<Array<string>>(query);

  const slugs = slugSchema
    .array()
    .parse(result)
    .map((nestedSlug) => nestedSlug.slug);

  return slugs.map((slug) => {
    return {
      params: {
        slug,
      },
    };
  });
};

/**
 * Get the n last published posts.
 * @param n how many posts to retrieve
 */
export const fetchPosts = async (n: number) => {
  const query = groq`
*[_type == "post" && !(_id in path('drafts.**'))][0...$n] | order(_createdAt desc) {
  _id,
  _createdAt,
  _updatedAt,
  title,
  "slug": slug.current,
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

  const result = await serverFetch<Array<Post>>(query, params);

  return postSchema.array().parse(result);
};

export const fetchPostBySlug = async (slug: string) => {
  const query = groq`
*[_type == "post"
  && slug.current == $slug
  && !(_id in path('drafts.**'))]
  | order(_createdAt desc) {
  _id,
  _createdAt,
  _updatedAt,
  title,
  "slug": slug.current,
  "authors": authors[]->{
    _id,
    name,
    image,
  },
  image,
  body
}[0]
      `;

  const params = {
    slug,
  };

  const result = await serverFetch<Post>(query, params);

  return postSchema.parse(result);
};
