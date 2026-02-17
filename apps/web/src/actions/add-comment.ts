"use server";

import { unoWithAdmin } from "@/api/server";
import { auth } from "@/auth/session";

export const addCommentAction = async (id: string, content: string) => {
  const user = await auth();

  if (!user) {
    return null;
  }

  if (!content) {
    return null;
  }

  await unoWithAdmin.comments.comment(id, user.id, content);

  return {
    success: true,
  };
};

export const addReplyAction = async (id: string, content: string, parentId: string) => {
  const user = await auth();

  if (!user) {
    return null;
  }

  await unoWithAdmin.comments.reply(id, user.id, content, parentId);

  return {
    success: true,
  };
};
