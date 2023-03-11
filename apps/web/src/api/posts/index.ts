import { groq } from "next-sanity";
import { sanityClient } from "../sanity.client";
import { Post, postSchema } from "./schemas";
import { slugSchema } from "@/utils/slug";
import { ErrorMessage } from "@/utils/error";

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
  } catch (error) {
    console.log(error); // eslint-disable-line
    return [];
  }
};

/**
 * Get the n last published posts.
 * @param n how many posts to retrieve
 */
export const fetchPosts = async (
  n: number
): Promise<Array<Post> | ErrorMessage> => {
  try {
    const limit = n === 0 ? `` : `[0...${n}]`;

    const query = groq`
          *[_type == "post" && !(_id in path('drafts.**'))] | order(_createdAt desc) {
              title,
              "slug": slug.current,
              "body": select(
                  body.en != null => {"no": body.no, "en": body.en},
                  body.no != null => {"no": body.no, "en": null},
                  body
                ),
              "author": author->name,
              _createdAt,
          }${limit}
      `;

    const result = await sanityClient.fetch<Array<Post>>(query);

    return postSchema.array().parse(result);
  } catch (error) {
    console.log(error); // eslint-disable-line
    return { message: JSON.stringify(error) };
  }
};

/**
 * Get a post by its slug.
 * @param slug the slug of the desired post.
 */
export const fetchPostBySlug = async (
  slug: string
): Promise<Post | ErrorMessage> => {
  try {
    const query = groq`
          *[_type == "post" && slug.current == $slug && !(_id in path('drafts.**'))] {
              title,
              "slug": slug.current,
              "body": select(
                  body.en != null => {"no": body.no, "en": body.en},
                  body.no != null => {"no": body.no, "en": null},
                  body
                ),
              "author": author->name,
              _createdAt,
          }[0]
        `;

    const params = {
      slug,
    };

    const result = await sanityClient.fetch<Post>(query, params);

    return postSchema.parse(result);
  } catch {
    return { message: "Failed to fetch post" };
  }
};
