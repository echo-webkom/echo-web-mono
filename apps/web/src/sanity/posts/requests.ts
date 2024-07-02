import { type AllPostsQueryResult } from "@/sanity.types";
import { sanityFetch } from "../client";
import { allPostsQuery } from "./queries";

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
