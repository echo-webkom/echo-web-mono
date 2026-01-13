"use server";

import { apiServer } from "@/api/server";
import { auth } from "@/auth/session";

export const addCommentAction = async (id: string, content: string) => {
  const user = await auth();

  if (!user) {
    return null;
  }

  if (!content) {
    return null;
  }

  await apiServer.post("comments", {
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
  const user = await auth();

  if (!user) {
    return null;
  }

  await apiServer.post("comments", {
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
