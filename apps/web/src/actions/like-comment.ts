"use server";

import { apiServer } from "@/api/server";
import { auth } from "@/auth/session";

export const likeComment = async (commentId: string) => {
  const user = await auth();

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
