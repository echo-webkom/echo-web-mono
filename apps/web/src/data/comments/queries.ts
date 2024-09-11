import { type Comment } from "@echo-webkom/db/schemas";

import { apiServer } from "@/api/server";

export const getCommentsById = (id: string) => {
  return apiServer.get(`admin/comments/${id}`).json<
    Array<
      Comment & {
        user: {
          id: string;
          name: string;
          image: string;
        };
      }
    >
  >();
};
