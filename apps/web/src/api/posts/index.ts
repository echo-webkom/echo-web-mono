import {groq} from "next-sanity";

import {type ErrorMessage} from "@/utils/error";
import {sanityClient} from "../sanity.client";
import {slugSchema} from "../utils/slug";
import {postSchema, type Post} from "./schemas";

export * from "./schemas";

/**
 * Get all slugs for posts.
 * @returns an array of slugs
 */
export const fetchPostPaths = async (): Promise<Array<string>> => {
  try {
    const query = groq`*[_type == "post"]{ "slug": slug.current }`;
    const result = await sanityClient.fetch<Array<string>>(query);

    return slugSchema
      .array()
      .parse(result)
      .map((nestedSlug) => nestedSlug.slug);
  } catch {
    return [];
  }
};

/**
 * Get the n last published posts.
 * @param n how many posts to retrieve
 */
export const fetchPosts = async (n: number): Promise<Array<Post> | ErrorMessage> => {
  try {
    const query = groq`
*[_type == "post" && !(_id in path('drafts.**'))] | order(_createdAt desc) {
  _id,
  _createdAt,
  _updatedAt,
  title,
  "slug": slug.current,
  "authors": authors[]->{
    _id,
    name,
  },
  "imageUrl": image.asset->url,
  body
}
      `;

    const params = {
      n,
    };

    const result = await sanityClient.fetch<Array<Post>>(query, params);

    return postSchema.array().parse(result);
  } catch (error) {
    console.error(error);
    return {
      message: "Failed to fetch posts.",
    };
  }
};

export const fetchPostBySlug = async (slug: string): Promise<Post | ErrorMessage> => {
  try {
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
  },
  "imageUrl": image.asset->url,
  body
}[0]
      `;

    const params = {
      slug,
    };

    const result = await sanityClient.fetch<Post>(query, params);

    return postSchema.parse(result);
  } catch (error) {
    console.error(error);
    return {
      message: "Failed to fetch posts.",
    };
  }
};
