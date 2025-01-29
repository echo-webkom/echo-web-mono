"use server";

import { apiServer } from "@/api/server";
import { getUser } from "@/lib/get-user";

export const likeComment = async (commentId: string) => {
  const user = await getUser();

  if (!user) {
    return { success: false };
  }

  const resp = await apiServer.post(`admin/comments/${commentId}/reaction`, {
    json: {
      commentId,
      userId: user.id,
    },
  });

  return await resp.json();
};
