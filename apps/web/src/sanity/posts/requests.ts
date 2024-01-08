import { sanityFetch } from "../client";
import { allPostsQuery } from "./queries";
import { postSchema, type Post } from "./schemas";

/**
 * Fetches all posts.
 */
export async function fetchAllPosts() {
  return await sanityFetch<Array<Post>>({
    query: allPostsQuery,
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
 * Get the posts for a given page. Default page size is 10.
 * Uses the `fetchPosts` under the hood.
 *
 * @param page page number to retrieve
 * @param pageSize number of posts per page
 * @returns an object with the posts and if there are more posts to retrieve
 */
export async function fetchPostsByPage(page: number, pageSize = 10) {
  const start = (page - 1) * pageSize;
  const end = page * pageSize;

  const posts = await fetchPosts();

  return {
    posts: posts.slice(start, end),
    hasMore: Boolean(posts[end + 1]),
  };
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
