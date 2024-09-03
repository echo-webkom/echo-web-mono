"use server";

import { revalidateComments } from "@/data/comments/revalidate";
import { db } from "@/db/drizzle";
import { comments } from "@/db/schemas";
import { getUser } from "@/lib/get-user";

export const addCommentAction = async (id: string, content: string) => {
  if (!content || typeof content !== "string" || !id || typeof id !== "string") {
    return null;
  }

  const user = await getUser();

  if (!user) {
    return null;
  }

  if (!content) {
    return null;
  }

  await db.insert(comments).values({
    content,
    postId: id,
    userId: user.id,
  });

  revalidateComments(id);

  return {
    success: true,
  };
};

export const addReplyAction = async (id: string, content: string, parentId: string) => {
  if (
    !content ||
    typeof content !== "string" ||
    !id ||
    typeof id !== "string" ||
    !parentId ||
    typeof parentId !== "string"
  ) {
    return null;
  }

  const user = await getUser();

  if (!user) {
    return null;
  }

  await db.insert(comments).values({
    content,
    postId: id,
    userId: user.id,
    parentCommentId: parentId,
  });

  revalidateComments(id);

  return {
    success: true,
  };
};
