import { unstable_cache as cache } from "next/cache";

import { db } from "@echo-webkom/db";

import { cacheKeyFactory } from "./revalidate";

export const getCommentsById = (id: string) =>
  cache(
    async () => {
      return await db.query.comments.findMany({
        where: (comment, { eq }) => eq(comment.postId, id),
        orderBy: (comment, { desc }) => [desc(comment.createdAt)],
        with: {
          user: {
            columns: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });
    },
    [cacheKeyFactory.comments(id)],
    {
      tags: [cacheKeyFactory.comments(id)],
    },
  )();
