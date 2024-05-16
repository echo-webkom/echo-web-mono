"use server";

import { and, eq } from "drizzle-orm";

import { db } from "@echo-webkom/db";
import { comments } from "@echo-webkom/db/schemas";

import { revalidateComments } from "@/data/comments/revalidate";
import { getUser } from "@/lib/get-user";

export const deleteCommentAction = async (body: FormData) => {
  const id = body.get("id");
  const postId = body.get("postId");

  if (!id || typeof id !== "string") {
    return {
      success: false,
      message: "Invalid id",
    };
  }

  if (!postId || typeof postId !== "string") {
    return {
      success: false,
      message: "Invalid postId",
    };
  }

  const user = await getUser();

  if (!user) {
    return {
      success: false,
      message: "User not found",
    };
  }

  await db.delete(comments).where(and(eq(comments.id, id), eq(comments.userId, user.id)));

  revalidateComments(postId);

  return {
    success: true,
  };
};
