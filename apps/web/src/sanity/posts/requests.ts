import { log } from "next-axiom";

import { type AllPostsQueryResult } from "@/sanity.types";
import { sanityFetch } from "../client";
import { allPostsQuery } from "./queries";

/**
 * Fetches all posts.
 */
export async function fetchAllPosts() {
  return await sanityFetch<AllPostsQueryResult>({
    query: allPostsQuery,
    cdn: true,
    tags: ["posts"],
  }).catch(() => {
    log.error("Failed to fetch all posts");

    return [];
  });
}

export async function fetchPosts(n?: number) {
  const posts = await fetchAllPosts();

  return n ? posts.slice(0, n) : posts;
}

/**
 * Fetches a post by its slug
 *
 * @param slug the slug of the posts you want to fetch
 * @returns the post or null if not found
 */
export async function fetchPostBySlug(slug: string): Promise<AllPostsQueryResult[number] | null> {
  return await fetchPosts().then((res) => res.find((post) => post.slug === slug) ?? null);
}
