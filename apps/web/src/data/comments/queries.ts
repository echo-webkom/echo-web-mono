import { type Comment } from "@echo-webkom/db/schemas";

import { apiServer } from "@/api/server";

export const getCommentsById = (id: string) => {
  return apiServer.get(`comments/${id}`).json<
    Array<
      Comment & {
        user: {
          id: string;
          name: string;
          image: string;
        };
      } & {
        reactions: Array<{
          commentId: string;
          userId: string;
          type: "like" | "dislike";
          createdAt: string;
        }>;
      }
    >
  >();
};
