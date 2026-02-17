"use server";

import { unoWithAdmin } from "@/api/server";
import { auth } from "@/auth/session";

export const likeComment = async (commentId: string) => {
  const user = await auth();

  if (!user) {
    return { success: false };
  }

  await unoWithAdmin.comments.like(commentId, user.id);

  return {
    success: true,
  };
};
