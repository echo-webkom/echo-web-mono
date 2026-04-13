"use server";

import { unoWithAdmin } from "@/api/server";
import { auth } from "@/auth/session";

export const likeComment = async (commentId: string) => {
  const user = await auth();

  if (!user) {
    return { success: false };
  }

  const ok = await unoWithAdmin.comments.like(commentId, user.id);

  return {
    success: ok,
  };
};
