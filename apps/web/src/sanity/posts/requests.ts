import { sanityFetch } from "../client";
import { slugSchema } from "../utils/slug";
import { allPostsQuery, postBySlugQuery, postSlugsQuery } from "./queries";
import { postSchema, type Post } from "./schemas";

/**
 * Get all slugs for posts.
 *
 * @returns an array of slugs
 */
export async function fetchPostParams() {
  try {
    return await sanityFetch<Array<string>>({
      query: postSlugsQuery,
      tags: ["post-params"],
    }).then((res) =>
      slugSchema
        .array()
        .parse(res)
        .map(({ slug }) => slug),
    );
  } catch {
    return [];
  }
}

/**
 * Get the n posts in descending order.
 *
 * @param n how many posts to retrieve. -1 for all
 */
export async function fetchPosts(n: number | undefined) {
  try {
    const posts = await sanityFetch<Array<Post>>({
      query: allPostsQuery,
      tags: ["posts"],
    }).then((res) => postSchema.array().parse(res));

    return n === -1 || n === undefined ? posts : posts.slice(0, n);
  } catch {
    return [];
  }
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

  const posts = await fetchPosts(-1).then((res) => res.slice(start, end));

  const hasMore = posts.length === pageSize;

  return {
    posts,
    hasMore,
  };
}

/**
 * Fetches a post by its slug
 *
 * @param slug the slug of the posts you want to fetch
 * @returns the post or null if not found
 */
export async function fetchPostBySlug(slug: string) {
  try {
    return await sanityFetch<Post | null>({
      query: postBySlugQuery,
      params: {
        slug,
      },
      tags: [`post-${slug}`],
    }).then((res) => postSchema.parse(res));
  } catch {
    return null;
  }
}
