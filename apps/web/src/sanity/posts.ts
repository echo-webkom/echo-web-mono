import { unoWithAdmin } from "@/api/server";

/**
 * Fetches all posts.
 */
export const fetchAllPosts = async () => {
  return await unoWithAdmin.sanity.posts.all().catch(() => {
    console.error("Failed to fetch all posts");
    return [];
  });
};

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
  return await fetchPosts().then((res) => res.find((post) => post.slug === slug) ?? null);
}
