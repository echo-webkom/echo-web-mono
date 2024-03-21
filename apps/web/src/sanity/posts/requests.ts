import { sanityFetch } from "../client";
import { allPostsQuery } from "./queries";
import { postSchema, type Post } from "./schemas";

/**
 * Fetches all posts.
 */
export async function fetchAllPosts() {
  return await sanityFetch<Array<Post>>({
    query: allPostsQuery,
    cdn: true,
    tags: ["posts"],
  })
    .then((res) => postSchema.array().parse(res))
    .catch(() => []);
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
export async function fetchPostBySlug(slug: string) {
  return await fetchPosts().then((res) => res.find((post) => post.slug === slug));
}
