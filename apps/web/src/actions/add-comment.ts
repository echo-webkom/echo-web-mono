"use server";

import { apiServer } from "@/api/server";
import { getUser } from "@/lib/get-user";

export const addCommentAction = async (id: string, content: string) => {
  const user = await getUser();

  if (!user) {
    return null;
  }

  if (!content) {
    return null;
  }

  await apiServer.post("admin/comments", {
    json: {
      content,
      postId: id,
      userId: user.id,
    },
  });

  return {
    success: true,
  };
};

export const addReplyAction = async (id: string, content: string, parentId: string) => {
  const user = await getUser();

  if (!user) {
    return null;
  }

  await apiServer.post("admin/comments", {
    json: {
      content,
      postId: id,
      userId: user.id,
      parentCommentId: parentId,
    },
  });

  return {
    success: true,
  };
};
