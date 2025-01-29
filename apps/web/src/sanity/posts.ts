import { type AllPostsQueryResult } from "@echo-webkom/cms/types";
import { allPostsQuery } from "@echo-webkom/sanity/queries";

import { sanityFetch } from "./client";

/**
 * Fetches all posts.
 */
export const fetchAllPosts = async () => {
  return await sanityFetch<AllPostsQueryResult>({
    query: allPostsQuery,
    cdn: true,
    tags: ["posts"],
  }).catch(() => {
    console.error("Failed to fetch all posts");

    return [];
  });
};

export const fetchPosts = async (n?: number) => {
  const posts = await fetchAllPosts();

  return n ? posts.slice(0, n) : posts;
};

/**
 * Fetches a post by its slug
 *
 * @param slug the slug of the posts you want to fetch
 * @returns the post or null if not found
 */
export const fetchPostBySlug = async (
  slug: string,
): Promise<AllPostsQueryResult[number] | null> => {
  return await fetchPosts().then((res) => res.find((post) => post.slug === slug) ?? null);
};
